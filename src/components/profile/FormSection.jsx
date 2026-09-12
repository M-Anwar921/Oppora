export default function FormSection({ icon: Icon, title, description, children }) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-base-card ring-1 ring-base-border">
      <div className="flex items-start gap-3 mb-5">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-accent-indigo/12 flex items-center justify-center shrink-0">
            <Icon size={18} strokeWidth={2} className="text-accent-indigo" />
          </div>
        )}
        <div>
          <h3 className="text-[17.2px] font-semibold text-ink-primary">{title}</h3>
          {description && <p className="text-[14.4px] text-ink-secondary mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}
