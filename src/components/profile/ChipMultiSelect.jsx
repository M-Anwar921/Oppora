import { Check } from 'lucide-react'

export default function ChipMultiSelect({ options, value, onChange, columns = 'wrap' }) {
  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className={columns === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 gap-2.5' : 'flex flex-wrap gap-2.5'}>
      {options.map((option) => {
        const active = value.includes(option)
        return (
          <button
            key={option}
            onClick={() => toggle(option)}
            className={[
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-colors ring-1 text-left',
              active
                ? 'bg-accent-indigo/12 ring-accent-indigo/40 text-ink-primary'
                : 'bg-base-surface ring-base-border text-ink-secondary hover:ring-base-borderStrong hover:text-ink-primary',
            ].join(' ')}
          >
            <span
              className={[
                'w-4 h-4 rounded-md flex items-center justify-center shrink-0 ring-1',
                active ? 'bg-accent-indigo ring-accent-indigo' : 'ring-base-borderStrong',
              ].join(' ')}
            >
              {active && <Check size={11} className="text-white" strokeWidth={3} />}
            </span>
            {option}
          </button>
        )
      })}
    </div>
  )
}
