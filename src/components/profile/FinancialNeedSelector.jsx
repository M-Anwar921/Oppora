const OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'prefer-not-to-specify', label: 'Prefer not to specify' },
]

export default function FinancialNeedSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            'px-4 py-2.5 rounded-xl text-[13.5px] ring-1 transition-colors',
            value === opt.value
              ? 'bg-accent-indigo/12 ring-accent-indigo/40 text-ink-primary'
              : 'bg-base-surface ring-base-border text-ink-secondary hover:ring-base-borderStrong hover:text-ink-primary',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
