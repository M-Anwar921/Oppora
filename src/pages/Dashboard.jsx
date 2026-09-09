import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Radar, Flame, CalendarClock, ArrowRight, UserRound } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import StatsCard from '../components/dashboard/StatsCard'
import PriorityOpportunityCard from '../components/dashboard/PriorityOpportunityCard'
import DeadlineTimeline from '../components/dashboard/DeadlineTimeline'
import InsightCard from '../components/dashboard/InsightCard'
import EmptyState from '../components/common/EmptyState'

export default function Dashboard() {
  const { opportunities, summary, hasAnalyzed, profileCompleteness } = useAppData()

  const topThree = [...opportunities].sort((a, b) => b.finalScore - a.finalScore).slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-3xl bg-base-card ring-1 ring-base-border p-8 lg:p-11 mb-8"
      >
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-accent-indigo/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-accent-cyan/8 blur-3xl pointer-events-none" />
        <div className="relative max-w-2xl">
          <h1 className="text-[30px] lg:text-[38px] font-semibold tracking-tight leading-[1.1]">
            Turn your inbox into your opportunity radar
          </h1>
          <p className="text-[15px] text-ink-secondary mt-4 leading-relaxed">
            Discover the internships, scholarships, competitions, fellowships, and opportunities that deserve your
            attention — ranked against your own profile, not a generic list.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-7">
            <Link
              to="/inbox"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-indigo hover:bg-accent-indigo/90 text-white text-[14px] font-medium transition-colors shadow-glow"
            >
              <Radar size={16} strokeWidth={2} />
              Analyze My Inbox
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-base-surface ring-1 ring-base-border hover:ring-base-borderStrong text-ink-primary text-[14px] font-medium transition-colors"
            >
              <UserRound size={16} strokeWidth={2} />
              Complete My Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Mail} value={summary.emailsAnalyzed} label="Emails analyzed" accent="blue" delay={0.05} />
        <StatsCard icon={Radar} value={summary.opportunitiesDetected} label="Opportunities found" accent="cyan" delay={0.1} />
        <StatsCard icon={Flame} value={summary.highPriorityMatches} label="High priority" accent="indigo" delay={0.15} />
        <StatsCard icon={CalendarClock} value={summary.urgentDeadlines} label="Deadlines this week" accent="critical" delay={0.2} />
      </div>

      {!hasAnalyzed && (
        <div className="mb-8">
          <EmptyState
            icon={Radar}
            title="Your inbox is ready for opportunities"
            description="Paste a batch of emails or load the demo inbox to see how ranking, scoring, and action plans come together."
            ctaLabel="Add Emails"
            ctaTo="/inbox"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-ink-primary">Priority opportunities</h2>
            <Link
              to="/results"
              className="inline-flex items-center gap-1 text-[13px] text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              View All Opportunities <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {topThree.map((o, i) => (
              <PriorityOpportunityCard key={o.id} opportunity={o} rank={i + 1} delay={0.05 * i} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-base-card ring-1 ring-base-border">
            <h2 className="text-[15px] font-semibold text-ink-primary mb-4">Upcoming deadlines</h2>
            <DeadlineTimeline opportunities={opportunities} />
          </div>
          <InsightCard insight={summary.insight} />
          {profileCompleteness < 100 && (
            <Link
              to="/profile"
              className="block p-4 rounded-2xl bg-base-card ring-1 ring-base-border hover:ring-base-borderStrong transition-shadow"
            >
              <p className="text-[13px] font-medium text-ink-primary">Your profile is {profileCompleteness}% complete</p>
              <p className="text-[12.5px] text-ink-secondary mt-1">Finish it for sharper opportunity matches.</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
