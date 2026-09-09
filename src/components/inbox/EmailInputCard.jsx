import { X, Mail } from 'lucide-react'

export default function EmailInputCard({ email, index, onChange, onRemove }) {
  const set = (key) => (e) => onChange({ ...email, [key]: e.target.value })

  return (
    <div className="p-4 rounded-2xl bg-base-card ring-1 ring-base-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-ink-tertiary">
          <Mail size={14} />
          <span className="text-[12px] font-medium tabular">Email {index + 1}</span>
        </div>
        <button onClick={onRemove} className="text-ink-tertiary hover:text-state-danger transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
        <input
          value={email.sender}
          onChange={set('sender')}
          placeholder="Sender email"
          className="px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[13px] text-ink-primary placeholder:text-ink-tertiary"
        />
        <input
          value={email.subject}
          onChange={set('subject')}
          placeholder="Subject line"
          className="px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[13px] text-ink-primary placeholder:text-ink-tertiary"
        />
      </div>

      <textarea
        value={email.body}
        onChange={set('body')}
        placeholder="Paste the email body here…"
        rows={4}
        className="w-full px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[13px] text-ink-primary placeholder:text-ink-tertiary resize-none"
      />
    </div>
  )
}
