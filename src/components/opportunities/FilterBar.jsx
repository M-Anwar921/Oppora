const FILTERS = ['All', 'High Priority', 'Urgent', 'Internship', 'Scholarship', 'Competition', 'Research', 'Fellowship', 'Remote', 'International']

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={[
            'shrink-0 px-3.5 py-2 rounded-full text-[14.9px] font-medium ring-1 transition-colors whitespace-nowrap',
            active === f
              ? 'bg-accent-indigo/15 ring-accent-indigo/40 text-ink-primary'
              : 'bg-base-surface ring-base-border text-ink-secondary hover:text-ink-primary hover:ring-base-borderStrong',
          ].join(' ')}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
