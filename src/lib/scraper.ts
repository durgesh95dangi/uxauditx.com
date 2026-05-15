// src/lib/scraper.ts
import { chromium as playwright } from 'playwright'
import * as cheerio from 'cheerio'
import * as fs from 'fs'
import type { ScrapedPage } from '@/types'

async function getBrowser() {
  // In Docker (Railway), the Playwright image pre-installs Chromium at /ms-playwright.
  // We find the executable dynamically to handle different Playwright versions.
  let executablePath: string | undefined = undefined

  const msPlaywrightPath = '/ms-playwright'
  if (fs.existsSync(msPlaywrightPath)) {
    // Find the chromium or chromium-headless-shell binary
    const dirs = fs.readdirSync(msPlaywrightPath)
    const chromiumDir = dirs.find(d => d.startsWith('chromium'))
    if (chromiumDir) {
      const candidates = [
        `${msPlaywrightPath}/${chromiumDir}/chrome-linux/chrome`,
        `${msPlaywrightPath}/${chromiumDir}/chrome-linux/headless_shell`,
        `${msPlaywrightPath}/${chromiumDir}/headless_shell`,
      ]
      executablePath = candidates.find(p => fs.existsSync(p))
    }
    // Also check headless-shell directory
    if (!executablePath) {
      const shellDir = dirs.find(d => d.startsWith('chromium_headless_shell'))
      if (shellDir) {
        const shellPath = `${msPlaywrightPath}/${shellDir}/chrome-linux/headless_shell`
        if (fs.existsSync(shellPath)) executablePath = shellPath
      }
    }
  }

  return playwright.launch({
    headless: true,
    executablePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  const browser = await getBrowser()
  const context = await browser.newContext()
  const page = await context.newPage()

  // Set a real user agent so sites don't block the bot
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
  })

  await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 })

  // Desktop screenshot — above the fold only (what user sees first)
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.waitForTimeout(1500)
  const desktopBuffer = await page.screenshot({
    fullPage: false,
    type: 'jpeg',
    quality: 65,
  })

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(1000)
  const mobileBuffer = await page.screenshot({
    fullPage: false,
    type: 'jpeg',
    quality: 65,
  })

  const html = await page.content()
  await browser.close()

  // Parse with Cheerio
  const $ = cheerio.load(html)
  $('script, style, noscript, iframe, [class*="cookie"], [id*="cookie"]').remove()

  // Extract CTA buttons — look for actual action buttons
  const ctaButtons: string[] = []
  $('button, a[class*="btn"], a[class*="cta"], input[type="submit"], a[href]').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim()
    if (text.length >= 2 && text.length <= 60) ctaButtons.push(text)
  })

  // Extract form fields
  const formFields: string[] = []
  $('input:not([type="hidden"]), textarea, select').each((_, el) => {
    const label = $(el).attr('placeholder')
      || $(el).attr('aria-label')
      || $(el).attr('name')
      || ''
    if (label) formFields.push(label)
  })

  // Extract image alt tags
  const imageAltTags: string[] = []
  $('img').each((_, el) => {
    const alt = $(el).attr('alt') || ''
    if (alt) imageAltTags.push(alt)
  })

  const bodyText = $('body')
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 3000)   // cap at 3000 chars — enough context for AI

  return {
    url,
    title: $('title').text().trim(),
    metaDescription: $('meta[name="description"]').attr('content') || '',
    h1: $('h1').first().text().trim(),
    h2s: $('h2').map((_, el) => $(el).text().trim()).get().slice(0, 8),
    h3s: $('h3').map((_, el) => $(el).text().trim()).get().slice(0, 6),
    ctaButtons: [...new Set(ctaButtons)].slice(0, 20),
    formFields: [...new Set(formFields)],
    bodyText,
    imageCount: $('img').length,
    imageAltTags: imageAltTags.slice(0, 10),
    hasHTTPS: url.startsWith('https'),
    wordCount: bodyText.split(' ').filter(Boolean).length,
    desktopScreenshot: desktopBuffer.toString('base64'),
    mobileScreenshot: mobileBuffer.toString('base64'),
  }
}

// Build a clean text summary of the page to send alongside screenshots
export function buildPageContext(page: ScrapedPage): string {
  return `
WEBSITE AUDIT DATA
==================
URL: ${page.url}
HTTPS: ${page.hasHTTPS ? 'Yes' : 'No — missing SSL'}
Page Title: ${page.title}
Meta Description: ${page.metaDescription || 'MISSING'}
Word Count: ${page.wordCount}
Image Count: ${page.imageCount}

HEADINGS:
H1: ${page.h1 || 'MISSING'}
H2s: ${page.h2s.length > 0 ? page.h2s.join(' | ') : 'None found'}
H3s: ${page.h3s.length > 0 ? page.h3s.join(' | ') : 'None found'}

CTA BUTTONS FOUND (${page.ctaButtons.length}):
${page.ctaButtons.length > 0 ? page.ctaButtons.map(b => `  • "${b}"`).join('\n') : '  None found'}

FORM FIELDS (${page.formFields.length}):
${page.formFields.length > 0 ? page.formFields.map(f => `  • ${f}`).join('\n') : '  No forms found'}

IMAGE ALT TAGS:
${page.imageAltTags.length > 0 ? page.imageAltTags.map(a => `  • ${a}`).join('\n') : '  None or missing'}

BODY TEXT (first 3000 chars):
${page.bodyText}
`.trim()
}
