export function SkillBar({ name, weight, value }: { name: string; weight?: number; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{name}</span>
        <span className="text-mute">
          {weight != null ? `${weight}% weight` : `${Math.round(value)}%`}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-teal transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}
