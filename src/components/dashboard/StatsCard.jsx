import { motion } from 'framer-motion'

const ACCENT_STYLES = {
  indigo: { bg: 'bg-accent-indigo/12', text: 'text-accent-indigo' },
  blue: { bg: 'bg-accent-blue/12', text: 'text-accent-blue' },
  cyan: { bg: 'bg-accent-cyan/12', text: 'text-accent-cyan' },
  critical: { bg: 'bg-state-critical/12', text: 'text-state-critical' },
}

export default function StatsCard({ icon: Icon, value, label, trend, accent = 'indigo', delay = 0 }) {
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.indigo
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="p-5 rounded-2xl bg-base-card ring-1 ring-base-border shadow-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg ${styles.bg} flex items-center justify-center`}>
          <Icon size={17} strokeWidth={2} className={styles.text} />
        </div>
        {trend && <span className="text-[11.5px] text-ink-tertiary">{trend}</span>}
      </div>
      <p className="text-[28px] font-semibold tracking-tight tabular leading-none">{value}</p>
      <p className="text-[13px] text-ink-secondary mt-1.5">{label}</p>
    </motion.div>
  )
}
