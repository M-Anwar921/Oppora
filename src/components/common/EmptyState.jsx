import { Link } from 'react-router-dom'

export default function EmptyState({ icon: Icon, title, description, ctaLabel, ctaTo, onCtaClick }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 rounded-2xl border border-dashed border-base-border bg-base-raised/40">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-base-card ring-1 ring-base-border flex items-center justify-center mb-5">
          <Icon size={22} strokeWidth={1.75} className="text-accent-cyan" />
        </div>
      )}
      <h3 className="text-[16px] font-semibold text-ink-primary mb-1.5">{title}</h3>
      {description && <p className="text-[13.5px] text-ink-secondary max-w-sm">{description}</p>}
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-indigo text-white text-[13.5px] font-medium hover:bg-accent-indigo/90 transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
      {ctaLabel && onCtaClick && !ctaTo && (
        <button
          onClick={onCtaClick}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-indigo text-white text-[13.5px] font-medium hover:bg-accent-indigo/90 transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
