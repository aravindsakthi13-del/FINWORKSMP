export const PIPELINE_STAGES = ['shortlisted', 'interview', 'offer', 'hired'] as const

export const STAGE_LABEL: Record<(typeof PIPELINE_STAGES)[number], string> = {
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offer: 'Offer',
  hired: 'Hired',
}
