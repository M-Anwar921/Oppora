import { useLocation, Link } from 'react-router-dom'
import { Radar } from 'lucide-react'

const TITLES = {
  '/': 'Dashboard',
  '/profile': 'My Profile',
  '/inbox': 'Opportunity Inbox',
  '/results': 'Rankings',
  '/settings': 'Settings',
}

function resolveTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/opportunity/')) return 'Opportunity Details'
  if (pathname.startsWith('/analyzing')) return 'Analyzing Inbox'
  return ''
}

export default function Header() {
  const { pathname } = useLocation()
  const title = resolveTitle(pathname)

  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-5 h-16 border-b border-base-border bg-base/90 backdrop-blur-md">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center">
          <Radar size={16} className="text-base" strokeWidth={2.5} />
        </div>
        <span className="text-[15.5px] font-semibold">Opportunity Copilot</span>
      </Link>
      {title && <span className="text-[14.9px] text-ink-secondary">{title}</span>}
    </header>
  )
}
