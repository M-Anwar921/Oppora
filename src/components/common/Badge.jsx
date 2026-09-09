import { PRIORITY_META } from '../../utils/format'

const TONE_STYLES = {
  neutral: 'bg-base-surface text-ink-secondary ring-1 ring-base-border',
  critical: 'bg-state-critical/12 text-state-critical ring-1 ring-state-critical/25',
  warning: 'bg-state-warning/12 text-state-warning ring-1 ring-state-warning/25',
  success: 'bg-state-success/12 text-state-success ring-1 ring-state-success/25',
  info: 'bg-accent-blue/12 text-accent-blue ring-1 ring-accent-blue/25',
}

export function Badge({ children, tone = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium tracking-wide ${TONE_STYLES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

const PRIORITY_TONE = {
  CRITICAL: 'critical',
  HIGH: 'warning',
  MEDIUM: 'info',
  LOW: 'neutral',
}

export function PriorityBadge({ priority, className = '' }) {
  const meta = PRIORITY_META[priority] || PRIORITY_META.LOW
  return (
    <Badge tone={PRIORITY_TONE[priority] || 'neutral'} className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  )
}

export function TypeBadge({ type, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide uppercase bg-base-surface text-ink-secondary ring-1 ring-base-border ${className}`}
    >
      {type}
    </span>
  )
}
