// src/audit-params/social-proof.ts
import type { AuditParam } from '@/types'

export const socialProof: AuditParam = {
  id: 'social_proof',
  name: 'Social Proof',
  category: 'trust',
  weight: 8,
  isFreePreview: true,

  description: 'People follow people. Social proof reduces purchase anxiety and is one of the highest-leverage conversion elements.',

  prompt: `Analyze the SOCIAL PROOF elements on this webpage.

You have been given screenshots and extracted page data. Look carefully at both images.

What to look for:
- Testimonials: Are they real (full name, photo, company/role) or generic ("John D. — Great product!")?
- Review counts and star ratings — visible on the page?
- Customer logos ("Trusted by companies like...")
- User/customer count metrics ("Join 10,000+ businesses")
- Case studies or success stories
- Press/media logos ("As seen in Forbes, TechCrunch...")
- Video testimonials (look in screenshots)
- Awards or certifications
- User-generated content

Rate the QUALITY and SPECIFICITY of social proof, not just quantity.
A single testimonial with full name, photo, company, and specific result ("increased revenue by 43%") is worth more than 10 generic star ratings.

If there is zero social proof, that is a critical conversion blocker. State it plainly.`,

  scoringRubric: {
    0:  'Zero social proof anywhere on the page. Pure claims with nothing to back them up.',
    4:  'Some social proof but weak — initials only, no photos, generic praise, or clearly fake-looking',
    7:  'Decent testimonials with names but missing photos, specific results, or company context',
    10: 'Rich, believable social proof: named testimonials with photos + roles, metrics, logos, review counts'
  }
}
