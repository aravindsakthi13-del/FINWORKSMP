export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'teal' | 'gold' | 'warn' | 'ink'
}) {
  const tones = {
    neutral: 'bg-mist text-ink/80',
    teal: 'bg-teal-bright/15 text-teal',
    gold: 'bg-gold/15 text-gold',
    warn: 'bg-amber-100 text-amber-900',
    ink: 'bg-ink text-mist',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  )
}
