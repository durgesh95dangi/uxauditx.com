// src/audit-params/visual-hierarchy.ts
import type { AuditParam } from '@/types'

export const visualHierarchy: AuditParam = {
  id: 'visual_hierarchy',
  name: 'Visual Hierarchy',
  category: 'design',
  weight: 5,
  isFreePreview: false,

  description: 'Visual hierarchy guides the eye from attention → interest → desire → action. Poor hierarchy means visitors do not know where to look.',

  prompt: `Analyze the VISUAL HIERARCHY of this webpage using BOTH screenshots.

This is a design analysis. Focus heavily on what you see in the images.

Look for:
- Is there a clear visual flow? Where does the eye naturally go first?
- Is the H1 headline the largest, most prominent element?
- Does the CTA button stand out with color contrast or size?
- Is there too much competing for attention (cluttered layout, multiple hero elements)?
- Is whitespace used to create breathing room and guide focus?
- Are there clear visual sections separated by space, color, or dividers?
- Is the font size hierarchy logical (H1 >> H2 >> body)?
- Does anything visually compete with the main CTA button?
- Are colors used purposefully or are there too many competing colors?

Describe what the eye does when first looking at the desktop screenshot. Where does it go? Is that where you WANT it to go?`,

  scoringRubric: {
    0:  'Cluttered, chaotic layout. No visual hierarchy. Eye has no direction. Everything fights for attention.',
    4:  'Has some structure but poor contrast, competing elements, or CTA does not stand out',
    7:  'Reasonable hierarchy but could be tighter — maybe too many visual weights competing',
    10: 'Clean, purposeful hierarchy. Eye flows naturally: headline → benefit → CTA. CTA stands out clearly.'
  }
}
