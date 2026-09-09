import { NavLink } from 'react-router-dom'
import { LayoutGrid, UserRound, Inbox, ListOrdered } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Home', icon: LayoutGrid },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/results', label: 'Rankings', icon: ListOrdered },
]

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-base-border bg-base-raised/95 backdrop-blur-md">
      <div className="flex items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex flex-col items-center gap-1 py-2.5 px-3 text-[11px] flex-1',
                isActive ? 'text-accent-cyan' : 'text-ink-tertiary',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
