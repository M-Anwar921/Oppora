import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PriorityBadge } from '../common/Badge'
import { formatDeadline, urgencyLabel } from '../../utils/format'

export default function PriorityOpportunityCard({ opportunity, rank, delay = 0 }) {
  const urgency = urgencyLabel(opportunity.deadline)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Link
        to={`/opportunity/${opportunity.id}`}
        className="flex items-center gap-4 p-4 rounded-2xl bg-base-card ring-1 ring-base-border hover:ring-base-borderStrong transition-shadow shadow-card group"
      >
        <div className="w-11 h-11 shrink-0 rounded-xl bg-base-surface ring-1 ring-base-border flex items-center justify-center">
          <span className="text-[15px] font-semibold text-accent-cyan tabular">#{rank}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14.5px] font-semibold text-ink-primary truncate">{opportunity.title}</p>
          </div>
          <p className="text-[12.5px] text-ink-secondary mt-0.5 truncate">{opportunity.organization}</p>
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
          <PriorityBadge priority={opportunity.priority} />
          <p className="text-[11.5px] text-ink-tertiary tabular">
            {formatDeadline(opportunity.deadline)} · {urgency.text}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[19px] font-semibold tabular leading-none group-hover:text-accent-cyan transition-colors">
            {opportunity.finalScore}
          </p>
          <p className="text-[11px] text-ink-tertiary">/ 100</p>
        </div>
      </Link>
    </motion.div>
  )
}
