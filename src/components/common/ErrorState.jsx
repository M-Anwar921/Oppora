import { AlertTriangle } from 'lucide-react'

export default function ErrorState({
  title = "Something didn't work",
  description = "We couldn't complete that action right now. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6 rounded-2xl border border-state-danger/20 bg-state-danger/5">
      <div className="w-14 h-14 rounded-2xl bg-state-danger/10 ring-1 ring-state-danger/25 flex items-center justify-center mb-5">
        <AlertTriangle size={22} strokeWidth={1.75} className="text-state-danger" />
      </div>
      <h3 className="text-[16px] font-semibold text-ink-primary mb-1.5">{title}</h3>
      <p className="text-[13.5px] text-ink-secondary max-w-sm">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-base-card ring-1 ring-base-borderStrong text-ink-primary text-[13.5px] font-medium hover:bg-base-surface transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}
