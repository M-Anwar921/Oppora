import { Sparkles } from 'lucide-react'

export default function InsightCard({ insight }) {
  return (
    <div className="relative p-5 rounded-2xl bg-gradient-to-br from-accent-indigo/10 via-base-card to-base-card ring-1 ring-accent-indigo/20 overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-accent-cyan/10 blur-2xl" />
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent-indigo/15 flex items-center justify-center shrink-0">
          <Sparkles size={17} className="text-accent-cyan" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[14.4px] font-medium text-ink-secondary mb-1.5">Opportunity insight</p>
          <p className="text-[16.1px] text-ink-primary leading-relaxed">{insight}</p>
        </div>
      </div>
    </div>
  )
}
