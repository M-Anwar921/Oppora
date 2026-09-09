import { Search } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-tertiary" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9.5 pl-10 pr-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border focus:ring-accent-indigo/50 outline-none text-[13.5px] text-ink-primary placeholder:text-ink-tertiary transition-shadow"
      />
    </div>
  )
}
