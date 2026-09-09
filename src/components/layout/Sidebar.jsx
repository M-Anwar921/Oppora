import { NavLink } from 'react-router-dom'
import { LayoutGrid, UserRound, Inbox, ListOrdered, Settings, Radar } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid },
  { to: '/profile', label: 'My Profile', icon: UserRound },
  { to: '/inbox', label: 'Opportunity Inbox', icon: Inbox },
  { to: '/results', label: 'Rankings', icon: ListOrdered },
]

export default function Sidebar() {
  const { profile, profileCompleteness } = useAppData()

  return (
    <aside className="hidden lg:flex lg:flex-col w-[260px] shrink-0 h-screen sticky top-0 border-r border-base-border bg-base-raised/60">
      <div className="flex items-center gap-2.5 px-6 h-20">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center shadow-glow">
          <Radar size={16} className="text-base" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold leading-tight tracking-tight">Opportunity</p>
          <p className="text-[13.5px] font-semibold leading-tight tracking-tight text-accent-cyan">Inbox Copilot</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-2 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] transition-colors',
                isActive
                  ? 'bg-base-card text-ink-primary shadow-card ring-1 ring-base-borderStrong'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-base-card/60',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} strokeWidth={2} className={isActive ? 'text-accent-cyan' : 'text-ink-tertiary group-hover:text-ink-secondary'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5 pt-3 space-y-3 border-t border-base-border mt-auto">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            [
              'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[14px] transition-colors',
              isActive ? 'bg-base-card text-ink-primary' : 'text-ink-secondary hover:text-ink-primary hover:bg-base-card/60',
            ].join(' ')
          }
        >
          <Settings size={17} strokeWidth={2} className="text-ink-tertiary" />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/profile" className="block px-3.5 py-3 rounded-xl glass ring-1 ring-base-border hover:ring-base-borderStrong transition-shadow">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[12.5px] text-ink-secondary">Profile strength</p>
            <p className="text-[12.5px] font-semibold text-accent-cyan tabular">{profileCompleteness}%</p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-base-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <p className="text-[12px] text-ink-tertiary mt-2 truncate">{profile?.program || 'Complete your profile'}</p>
        </NavLink>
      </div>
    </aside>
  )
}
