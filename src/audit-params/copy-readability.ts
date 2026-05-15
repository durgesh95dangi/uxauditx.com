// src/audit-params/copy-readability.ts
import type { AuditParam } from '@/types'

export const copyReadability: AuditParam = {
  id: 'copy_readability',
  name: 'Copy Readability',
  category: 'copy',
  weight: 5,
  isFreePreview: false,

  description: 'If copy is hard to read — long sentences, jargon, dense paragraphs — visitors skim and miss the message entirely.',

  prompt: `Analyze the COPY READABILITY of this webpage using the extracted body text.

Look for:
- Sentence length: are sentences short and punchy or long and complex?
- Paragraph length: are paragraphs 1-3 lines or large walls of text?
- Jargon or industry buzzwords that a general visitor might not understand
- Active vs passive voice ("We help you save time" vs "Time savings are enabled by our platform")
- Use of bullet points to break up information
- Reading level: is it written at a clear, accessible level?
- Does the copy speak to the reader ("you") or talk about the company ("we", "our")?
- Are key benefits emphasized visually (bold, headers) or buried in body text?

Scan the body text excerpt provided and identify specific examples of dense, unclear, or jargon-heavy copy. Quote actual sentences that are problematic.`,

  scoringRubric: {
    0:  'Walls of text, heavy jargon, passive voice, no visual hierarchy in copy. Unreadable.',
    4:  'Some readable sections but overall dense with jargon or long paragraphs',
    7:  'Mostly readable but has some long sentences or occasional jargon to clean up',
    10: 'Crisp, clear, scannable copy. Short sentences. Reader-focused ("you"). Benefits bolded.'
  }
}
