import { z } from 'zod'

/**
 * Validation schemas for every server entry point.
 * Always parse with .safeParse() and return a generic error on failure.
 */

export const checkClaimSchema = z.object({
  claim: z
    .string()
    .trim()
    .min(10, 'Claim is too short — give us at least 10 characters.')
    .max(2000, 'Claim is too long — keep it under 2000 characters.'),
  url: z
    .string()
    .trim()
    .url('That does not look like a valid URL.')
    .max(2048, 'URL is too long.')
    .optional()
    .or(z.literal('')),
})

export type CheckClaimInput = z.infer<typeof checkClaimSchema>
