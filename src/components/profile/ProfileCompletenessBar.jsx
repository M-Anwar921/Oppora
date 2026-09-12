export default function ProfileCompletenessBar({ percent }) {
  return (
    <div className="p-5 rounded-2xl bg-base-card ring-1 ring-base-border flex items-center gap-5">
      <div className="relative w-16 h-16 shrink-0">
        <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
          <circle cx="32" cy="32" r="27" fill="none" stroke="currentColor" strokeWidth="6" className="text-base-surface" />
          <circle
            cx="32"
            cy="32"
            r="27"
            fill="none"
            stroke="url(#completeness-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 27}
            strokeDashoffset={2 * Math.PI * 27 * (1 - percent / 100)}
          />
          <defs>
            <linearGradient id="completeness-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6C7CF6" />
              <stop offset="100%" stopColor="#3FD6E0" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[15.5px] font-semibold tabular">
          {percent}%
        </span>
      </div>
      <div>
        <p className="text-[16.7px] font-semibold text-ink-primary">Profile completeness</p>
        <p className="text-[14.9px] text-ink-secondary mt-1">
          A more complete profile means sharper matching and more accurate opportunity scores.
        </p>
      </div>
    </div>
  )
}
