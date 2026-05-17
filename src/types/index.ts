// src/types/index.ts

export type AuditStatus =
  | 'pending' | 'scraping' | 'analyzing'
  | 'complete' | 'failed'

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type ParamCategory =
  | 'conversion' | 'copy' | 'trust'
  | 'ux' | 'seo' | 'performance' | 'design'

export type AIProvider = 'openai' | 'gemini' | 'grok' | 'anthropic'

export interface AuditParam {
  id: string
  name: string
  category: ParamCategory
  weight: number           // 1–10
  isFreePreview: boolean   // exactly 4 params set true
  description: string
  prompt: string           // full prompt sent to AI for this param
  scoringRubric: { 0: string; 4: string; 7: string; 10: string }
}

export interface ParamResult {
  id: string
  name: string
  category: ParamCategory
  score: number            // 0–10
  severity: Severity
  title: string
  problem: string
  fix: string
  example: string
  impact: string
  isFreePreview: boolean
}

export interface AuditResult {
  auditId: string
  overallScore: number     // 0–100 weighted
  summary: string
  freeIssues: ParamResult[]
  allIssues?: ParamResult[]
  totalIssues: number
}

export interface ScrapedPage {
  url: string
  title: string
  metaDescription: string
  h1: string
  h2s: string[]
  h3s: string[]
  ctaButtons: string[]
  formFields: string[]
  bodyText: string
  imageCount: number
  imageAltTags: string[]
  hasHTTPS: boolean
  wordCount: number
  desktopScreenshot: string   // base64 jpeg
  mobileScreenshot: string    // base64 jpeg
}
