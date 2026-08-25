import { Link } from 'react-router-dom'

export function StatCard({
  label,
  value,
  hint,
  to,
}: {
  label: string
  value: string | number
  hint?: string
  to?: string
}) {
  const inner = (
    <>
      <p className="text-xs uppercase tracking-[0.16em] text-mute">{label}</p>
      <p className="mt-3 font-serif text-4xl tracking-tight text-ink">{value}</p>
      {hint ? <p className="mt-2 text-sm text-mute">{hint}</p> : null}
    </>
  )

  const className =
    'rounded-2xl border border-line bg-white p-5 shadow-[0_1px_0_rgba(11,18,32,0.04)] transition hover:-translate-y-0.5 hover:border-ink/20'

  if (to) {
    return (
      <Link to={to} className={`${className} block`}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}
