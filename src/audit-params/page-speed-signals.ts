// src/audit-params/page-speed-signals.ts
import type { AuditParam } from '@/types'

export const pageSpeedSignals: AuditParam = {
  id: 'page_speed_signals',
  name: 'Page Speed Signals',
  category: 'performance',
  weight: 4,
  isFreePreview: false,

  description: 'Page speed affects both conversions and SEO. A 1-second delay reduces conversions by 7%. Look for signals in the page code and screenshot.',

  prompt: `Analyze PAGE SPEED SIGNALS on this webpage.

You cannot run actual speed tests, but you can identify red flags from the page data:

Look for:
- Number of images on the page (image count from data). Many large images = slow.
- Are images likely to be unoptimized (no WebP, no lazy loading signals in alt tags)?
- Is there a large amount of render-blocking content visible?
- Does the page screenshot show the page loaded cleanly or are there broken elements?
- Heavy third-party scripts that slow load: live chat widgets, video players, multiple analytics tools
- Is there a cookie consent banner that blocks the page (visible in screenshot)?
- How much text content is there vs visual assets? (word count vs image count ratio)
- Are there any visible loading spinners or incomplete renders in the screenshot?

Be transparent: state that you are analyzing signals, not running a real speed test, and recommend they test on PageSpeed Insights (pagespeed.web.dev) for actual numbers.`,

  scoringRubric: {
    0:  'Clear red flags: dozens of images, blocking banners, broken elements visible, extremely heavy page',
    4:  'Several speed risk signals: many images, likely unoptimized assets, heavy third-party scripts',
    7:  'A few minor signals but generally looks reasonable',
    10: 'Clean, lean page. Few images, minimal blocking content. Likely fast loading.'
  }
}
