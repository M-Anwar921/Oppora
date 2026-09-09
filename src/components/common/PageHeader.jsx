export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[26px] lg:text-[30px] font-semibold tracking-tight text-ink-primary">{title}</h1>
        {description && <p className="text-[14px] text-ink-secondary mt-1.5 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  )
}
