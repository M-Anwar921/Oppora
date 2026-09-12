import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function ActionChecklist({ items, onToggle }) {
  const completed = items.filter((i) => i.completed).length
  const percent = items.length ? Math.round((completed / items.length) * 100) : 0

  return (
    <div className="p-6 rounded-2xl bg-base-card ring-1 ring-base-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[17.2px] font-semibold text-ink-primary">Your Action Plan</h3>
        <span className="text-[14.9px] font-medium text-accent-cyan tabular">{percent}% complete</span>
      </div>

      <div className="h-1.5 rounded-full bg-base-surface overflow-hidden mb-6">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="space-y-1">
        {items.map((item, i) => (
          <button
            key={item.title}
            onClick={() => onToggle(i)}
            className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-base-surface/70 transition-colors text-left"
          >
            <span
              className={[
                'w-5 h-5 rounded-md flex items-center justify-center shrink-0 ring-1 transition-colors',
                item.completed ? 'bg-state-success ring-state-success' : 'ring-base-borderStrong',
              ].join(' ')}
            >
              {item.completed && <Check size={15} className="text-base" strokeWidth={3} />}
            </span>
            <span className={`text-[15.5px] ${item.completed ? 'text-ink-tertiary line-through' : 'text-ink-primary'}`}>
              {item.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
