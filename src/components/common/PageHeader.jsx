export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[29.9px] lg:text-[34.5px] font-semibold tracking-tight text-ink-primary">{title}</h1>
        {description && <p className="text-[16.1px] text-ink-secondary mt-1.5 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  )
}
