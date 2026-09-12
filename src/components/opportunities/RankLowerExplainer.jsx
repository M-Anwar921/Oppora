import { X, Check } from 'lucide-react'

export default function RankLowerExplainer({ gaps }) {
  if (!gaps?.length) return null
  return (
    <div className="p-5 rounded-2xl bg-state-warning/5 ring-1 ring-state-warning/20">
      <p className="text-[16.1px] font-semibold text-ink-primary mb-4">Why this ranks lower</p>
      <div className="space-y-3">
        {gaps.map((gap) => (
          <div key={gap.label} className="flex items-start gap-3">
            <span
              className={[
                'w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ring-1',
                gap.met ? 'bg-state-success/15 ring-state-success/40' : 'bg-state-warning/15 ring-state-warning/40',
              ].join(' ')}
            >
              {gap.met ? (
                <Check size={13} className="text-state-success" strokeWidth={3} />
              ) : (
                <X size={13} className="text-state-warning" strokeWidth={3} />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-[14.9px] font-medium text-ink-primary">{gap.label}</p>
              <p className="text-[14.4px] text-ink-secondary mt-0.5">
                Yours: {gap.yours} · Required: {gap.required}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
