import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { PriorityBadge, TypeBadge } from '../common/Badge'
import { formatDeadline, urgencyLabel } from '../../utils/format'

function buildMatchIndicators(opportunity) {
  const indicators = []
  if (opportunity.profileFitScore >= 70) indicators.push('Profile fit')
  if (opportunity.skills?.length) indicators.push(opportunity.skills[0])
  if (opportunity.eligibility?.some((e) => e.toLowerCase().includes('cgpa'))) indicators.push('CGPA match')
  if (opportunity.completenessScore >= 90) indicators.push('Eligible')
  return indicators.slice(0, 4)
}

export default function OpportunityCard({ opportunity, rank, delay = 0 }) {
  const urgency = urgencyLabel(opportunity.deadline)
  const matches = buildMatchIndicators(opportunity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
      className="p-5 rounded-2xl bg-base-card ring-1 ring-base-border hover:ring-base-borderStrong shadow-card transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="text-[13px] font-semibold text-ink-tertiary tabular">#{rank}</span>
          <TypeBadge type={opportunity.type} />
        </div>
        <PriorityBadge priority={opportunity.priority} />
      </div>

      <h3 className="text-[16px] font-semibold text-ink-primary leading-snug">{opportunity.title}</h3>
      <p className="text-[13px] text-ink-secondary mt-1">{opportunity.organization}</p>

      <div className="flex items-center gap-4 mt-4">
        <div>
          <p className="text-[22px] font-semibold tabular leading-none">{opportunity.finalScore}</p>
          <p className="text-[11px] text-ink-tertiary mt-0.5">/ 100 score</p>
        </div>
        <div className="w-px h-9 bg-base-border" />
        <div>
          <p className={`text-[13px] font-medium tabular ${urgency.tone === 'critical' ? 'text-state-critical' : 'text-ink-primary'}`}>
            {urgency.text}
          </p>
          <p className="text-[11.5px] text-ink-tertiary mt-0.5">{formatDeadline(opportunity.deadline)}</p>
        </div>
      </div>

      {matches.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4">
          {matches.map((m) => (
            <span key={m} className="inline-flex items-center gap-1 text-[12px] text-state-success">
              <CheckCircle2 size={12.5} strokeWidth={2.25} />
              {m}
            </span>
          ))}
        </div>
      )}

      <Link
        to={`/opportunity/${opportunity.id}`}
        className="inline-flex items-center gap-1.5 mt-5 text-[13px] font-medium text-accent-cyan hover:text-accent-cyan/80 transition-colors"
      >
        View Full Analysis <ArrowRight size={13} />
      </Link>
    </motion.div>
  )
}
