export function daysRemaining(deadline) {
  if (!deadline) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(deadline)
  due.setHours(0, 0, 0, 0)
  const diffMs = due.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export function formatDeadline(deadline) {
  if (!deadline) return 'Not specified in the email'
  const due = new Date(deadline)
  return due.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function urgencyLabel(deadline) {
  const days = daysRemaining(deadline)
  if (days === null) return { text: 'No deadline found', tone: 'neutral' }
  if (days < 0) return { text: 'Deadline passed', tone: 'expired' }
  if (days === 0) return { text: 'Due today', tone: 'critical' }
  if (days === 1) return { text: '1 day left', tone: 'critical' }
  if (days <= 3) return { text: `${days} days left`, tone: 'critical' }
  if (days <= 7) return { text: `${days} days left`, tone: 'warning' }
  return { text: `${days} days left`, tone: 'normal' }
}

export const PRIORITY_META = {
  CRITICAL: { label: 'Critical', range: '90–100', color: 'state-critical', ring: 'ring-state-critical/40' },
  HIGH: { label: 'High priority', range: '75–89', color: 'state-high', ring: 'ring-state-high/40' },
  MEDIUM: { label: 'Medium priority', range: '50–74', color: 'state-medium', ring: 'ring-state-medium/40' },
  LOW: { label: 'Low priority', range: '0–49', color: 'state-low', ring: 'ring-state-low/40' },
}

export function priorityFromScore(score) {
  if (score >= 90) return 'CRITICAL'
  if (score >= 75) return 'HIGH'
  if (score >= 50) return 'MEDIUM'
  return 'LOW'
}

export function initialsFromOrg(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
