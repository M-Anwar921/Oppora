import { Link } from 'react-router-dom'
import { daysRemaining } from '../../utils/format'

export default function DeadlineTimeline({ opportunities }) {
  const upcoming = [...opportunities]
    .filter((o) => daysRemaining(o.deadline) >= 0)
    .sort((a, b) => daysRemaining(a.deadline) - daysRemaining(b.deadline))
    .slice(0, 5)

  if (upcoming.length === 0) {
    return <p className="text-[13.5px] text-ink-tertiary">No upcoming deadlines yet.</p>
  }

  return (
    <div className="relative pl-5">
      <div className="absolute left-[5px] top-1.5 bottom-1.5 w-px bg-base-border" />
      <div className="space-y-5">
        {upcoming.map((o) => {
          const days = daysRemaining(o.deadline)
          const urgent = days <= 3
          return (
            <Link key={o.id} to={`/opportunity/${o.id}`} className="relative block group">
              <span
                className={`absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-base-card ${
                  urgent ? 'bg-state-critical' : 'bg-accent-blue'
                }`}
              />
              <p className="text-[13.5px] font-medium text-ink-primary group-hover:text-accent-cyan transition-colors truncate">
                {o.title}
              </p>
              <p className={`text-[12px] mt-0.5 tabular ${urgent ? 'text-state-critical' : 'text-ink-tertiary'}`}>
                {days === 0 ? 'Due today' : `${days} day${days === 1 ? '' : 's'} remaining`}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
