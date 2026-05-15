// src/audit-params/seo-basics.ts
import type { AuditParam } from '@/types'

export const seoBasics: AuditParam = {
  id: 'seo_basics',
  name: 'SEO Basics',
  category: 'seo',
  weight: 3,
  isFreePreview: false,

  description: 'Basic on-page SEO affects organic discoverability. Missing fundamentals mean this page will not rank even for its own brand name.',

  prompt: `Analyze the basic ON-PAGE SEO of this webpage.

Using the extracted page data, check:
- Title tag: Is it present? Is it descriptive and under 60 characters? Does it include a keyword?
- Meta description: Is it present? Is it compelling and under 160 characters? (missing = Google auto-generates, often bad)
- H1: Is there exactly ONE H1? Does it include the primary keyword?
- H2s: Are they used to structure content logically?
- Image alt tags: Are images described with alt text or are alt tags empty/missing?
- HTTPS: Is the site on HTTPS? (already in data)
- URL structure: Can you infer from the page whether URLs are clean and descriptive?
- Keyword usage: Is the primary topic/keyword visible in the headline and opening paragraph?

Flag which of these are missing entirely vs just could be improved.
SEO impacts long-term organic traffic which is free customer acquisition.`,

  scoringRubric: {
    0:  'No title, no meta description, no H1, missing alt tags, no HTTPS. Invisible to search engines.',
    4:  'Title and H1 present but meta description missing, alt tags empty, poor keyword usage',
    7:  'Most basics covered but meta description weak or H1 not optimized',
    10: 'All basics perfect: strong title, compelling meta description, keyword-rich H1, alt tags, HTTPS'
  }
}
