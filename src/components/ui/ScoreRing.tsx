export function ScoreRing({ score, size = 168, label = 'Match' }: { score: number; size?: number; label?: string }) {
  const r = 54
  const c = 2 * Math.PI * r
  const offset = c * (1 - Math.min(score, 100) / 100)
  const tone = score >= 88 ? '#0f766e' : score >= 80 ? '#b0894d' : '#5c6578'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 132 132" className="-rotate-90" width={size} height={size} aria-hidden>
        <circle cx="66" cy="66" r={r} fill="none" stroke="#e6e0d4" strokeWidth="10" />
        <circle
          cx="66"
          cy="66"
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-4xl leading-none tracking-tight text-ink">{score}%</span>
        <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-mute">{label}</span>
      </div>
    </div>
  )
}
