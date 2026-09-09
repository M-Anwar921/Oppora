import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const SUGGESTIONS = ['AI Projects', 'Web Development', 'Research', 'Teaching', 'Hackathons', 'Freelancing']

export default function PastExperienceEditor({ value, onChange }) {
  const [label, setLabel] = useState('')
  const [detail, setDetail] = useState('')

  const addEntry = () => {
    const trimmed = label.trim()
    if (!trimmed) return
    onChange([...value, { id: `exp-${Date.now()}`, label: trimmed, detail: detail.trim() }])
    setLabel('')
    setDetail('')
  }

  const removeEntry = (id) => onChange(value.filter((e) => e.id !== id))

  return (
    <div>
      <div className="space-y-2.5 mb-4">
        {value.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-base-surface ring-1 ring-base-border"
          >
            <div className="min-w-0">
              <p className="text-[13.5px] font-medium text-ink-primary">{entry.label}</p>
              {entry.detail && <p className="text-[12.5px] text-ink-secondary mt-0.5">{entry.detail}</p>}
            </div>
            <button onClick={() => removeEntry(entry.id)} className="text-ink-tertiary hover:text-state-danger transition-colors shrink-0">
              <X size={15} />
            </button>
          </div>
        ))}
        {value.length === 0 && <p className="text-[13px] text-ink-tertiary">No experience added yet.</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-2.5">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. AI Projects"
          className="px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[13.5px] text-ink-primary placeholder:text-ink-tertiary"
        />
        <input
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Optional short detail"
          className="px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[13.5px] text-ink-primary placeholder:text-ink-tertiary"
        />
        <button
          onClick={addEntry}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border hover:ring-base-borderStrong transition-shadow text-[13px] text-ink-secondary"
        >
          <Plus size={15} /> Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {SUGGESTIONS.filter((s) => !value.some((v) => v.label === s)).map((s) => (
          <button
            key={s}
            onClick={() => onChange([...value, { id: `exp-${Date.now()}-${s}`, label: s, detail: '' }])}
            className="px-2.5 py-1 rounded-full text-[12px] text-ink-secondary ring-1 ring-base-border hover:ring-accent-indigo/40 hover:text-ink-primary transition-colors"
          >
            + {s}
          </button>
        ))}
      </div>
    </div>
  )
}
