function shimmer(className) {
  return <div className={`relative overflow-hidden rounded-lg bg-base-surface ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
  </div>
}

export function CardSkeleton({ className = '' }) {
  return (
    <div className={`p-5 rounded-2xl bg-base-card ring-1 ring-base-border space-y-3 ${className}`}>
      {shimmer('h-3 w-1/3')}
      {shimmer('h-5 w-2/3')}
      {shimmer('h-3 w-1/2')}
      <div className="flex gap-2 pt-1">
        {shimmer('h-6 w-16')}
        {shimmer('h-6 w-16')}
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} className="h-28" />
      ))}
    </div>
  )
}
