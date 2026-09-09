import { useState } from 'react'
import { X, Plus } from 'lucide-react'

export default function SkillsSelector({ value, onChange, suggestions = [] }) {
  const [draft, setDraft] = useState('')

  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (!trimmed || value.includes(trimmed)) return
    onChange([...value, trimmed])
    setDraft('')
  }

  const removeSkill = (skill) => onChange(value.filter((s) => s !== skill))

  const remainingSuggestions = suggestions.filter((s) => !value.includes(s))

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-accent-indigo/12 ring-1 ring-accent-indigo/25 text-[13px] text-ink-primary"
          >
            {skill}
            <button onClick={() => removeSkill(skill)} className="hover:text-state-danger transition-colors">
              <X size={13} />
            </button>
          </span>
        ))}
        {value.length === 0 && <p className="text-[13px] text-ink-tertiary py-1.5">No skills added yet.</p>}
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(draft))}
          placeholder="Add a skill and press Enter"
          className="flex-1 px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[13.5px] text-ink-primary placeholder:text-ink-tertiary"
        />
        <button
          onClick={() => addSkill(draft)}
          className="px-3.5 rounded-lg bg-base-surface ring-1 ring-base-border hover:ring-base-borderStrong transition-shadow"
        >
          <Plus size={16} className="text-ink-secondary" />
        </button>
      </div>

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {remainingSuggestions.slice(0, 9).map((s) => (
            <button
              key={s}
              onClick={() => addSkill(s)}
              className="px-2.5 py-1 rounded-full text-[12px] text-ink-secondary ring-1 ring-base-border hover:ring-accent-indigo/40 hover:text-ink-primary transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
