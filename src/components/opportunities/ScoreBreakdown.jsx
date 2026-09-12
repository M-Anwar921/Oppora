import { motion } from 'framer-motion'

const ROWS = [
  { key: 'profileFitScore', label: 'Profile Fit', weight: 50 },
  { key: 'urgencyScore', label: 'Urgency', weight: 30 },
  { key: 'completenessScore', label: 'Information Completeness', weight: 20 },
]

export default function ScoreBreakdown({ opportunity }) {
  return (
    <div className="p-6 rounded-2xl bg-base-card ring-1 ring-base-border">
      <div className="flex items-center gap-6 mb-7">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 96 96" className="w-24 h-24 -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-base-surface" />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="url(#score-gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 40}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - opportunity.finalScore / 100) }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6C7CF6" />
                <stop offset="100%" stopColor="#3FD6E0" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[27.6px] font-semibold tabular">
            {opportunity.finalScore}
          </span>
        </div>
        <div>
          <p className="text-[16.7px] font-semibold text-ink-primary">Overall Opportunity Score</p>
          <p className="text-[14.9px] text-ink-secondary mt-1">
            A weighted blend of how well this fits your profile, how urgent it is, and how complete the listing is.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {ROWS.map((row) => (
          <div key={row.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[14.9px] text-ink-secondary">
                {row.label} <span className="text-ink-tertiary">· {row.weight}% weight</span>
              </span>
              <span className="text-[14.9px] font-medium text-ink-primary tabular">{opportunity[row.key]} / 100</span>
            </div>
            <div className="h-2 rounded-full bg-base-surface overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                initial={{ width: 0 }}
                animate={{ width: `${opportunity[row.key]}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
