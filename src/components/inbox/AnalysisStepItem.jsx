import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function AnalysisStepItem({ label, status, delay }) {
  // status: 'pending' | 'active' | 'done'
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: status === 'pending' ? 0.35 : 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className="flex items-center gap-3.5"
    >
      <div
        className={[
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-1 transition-colors',
          status === 'done'
            ? 'bg-state-success/15 ring-state-success/40'
            : status === 'active'
            ? 'bg-accent-indigo/15 ring-accent-indigo/50'
            : 'bg-base-surface ring-base-border',
        ].join(' ')}
      >
        {status === 'done' && <Check size={13} className="text-state-success" strokeWidth={2.75} />}
        {status === 'active' && (
          <motion.span
            className="w-2 h-2 rounded-full bg-accent-cyan"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </div>
      <span className={`text-[14px] ${status === 'pending' ? 'text-ink-tertiary' : 'text-ink-primary'}`}>{label}</span>
    </motion.div>
  )
}
