import { CheckCircle2 } from 'lucide-react'

export default function EvidenceCard({ title, reasons }) {
  if (!reasons?.length) return null
  return (
    <div className="p-4 rounded-xl bg-base-surface ring-1 ring-base-border">
      <p className="text-[13px] font-medium text-ink-primary mb-3">{title}</p>
      <ul className="space-y-2">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-[13px] text-ink-secondary">
            <CheckCircle2 size={14} className="text-state-success shrink-0 mt-0.5" strokeWidth={2.25} />
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
