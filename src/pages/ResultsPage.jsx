import { useMemo, useState } from 'react'
import { Radar, ArrowUpDown } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import PageHeader from '../components/common/PageHeader'
import SearchInput from '../components/common/SearchInput'
import FilterBar from '../components/opportunities/FilterBar'
import OpportunityCard from '../components/opportunities/OpportunityCard'
import InsightCard from '../components/dashboard/InsightCard'
import EmptyState from '../components/common/EmptyState'
import { daysRemaining } from '../utils/format'

const SORT_OPTIONS = [
  { id: 'score', label: 'Highest Score' },
  { id: 'deadline', label: 'Closest Deadline' },
  { id: 'fit', label: 'Best Profile Match' },
  { id: 'newest', label: 'Newest' },
]

function matchesFilter(o, filter) {
  switch (filter) {
    case 'All':
      return true
    case 'High Priority':
      return o.priority === 'HIGH' || o.priority === 'CRITICAL'
    case 'Urgent':
      return daysRemaining(o.deadline) <= 5
    case 'Remote':
      return o.location?.toLowerCase().includes('remote')
    case 'International':
      return o.location?.toLowerCase().includes('international')
    default:
      return o.type === filter
  }
}

export default function ResultsPage() {
  const { opportunities, summary, hasAnalyzed } = useAppData()
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('score')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = opportunities.filter((o) => matchesFilter(o, filter))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.organization.toLowerCase().includes(q) ||
          o.type.toLowerCase().includes(q) ||
          o.skills?.some((s) => s.toLowerCase().includes(q))
      )
    }
    const sorted = [...list]
    if (sort === 'score') sorted.sort((a, b) => b.finalScore - a.finalScore)
    if (sort === 'deadline') sorted.sort((a, b) => daysRemaining(a.deadline) - daysRemaining(b.deadline))
    if (sort === 'fit') sorted.sort((a, b) => b.profileFitScore - a.profileFitScore)
    if (sort === 'newest') sorted.sort((a, b) => b.id.localeCompare(a.id))
    return sorted
  }, [opportunities, filter, sort, search])

  if (!hasAnalyzed) {
    return (
      <div>
        <PageHeader title="Your Opportunity Radar" description="We analyzed your inbox and found opportunities worth your attention." />
        <EmptyState
          icon={Radar}
          title="No opportunities yet"
          description="Analyze your inbox to see personalized rankings, scores, and evidence for every match."
          ctaLabel="Add Emails"
          ctaTo="/inbox"
        />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Your Opportunity Radar" description="We analyzed your inbox and found opportunities worth your attention." />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          [summary.emailsAnalyzed, 'Emails analyzed'],
          [summary.opportunitiesDetected, 'Opportunities detected'],
          [summary.highPriorityMatches, 'High priority matches'],
          [summary.urgentDeadlines, 'Urgent deadlines'],
        ].map(([value, label]) => (
          <div key={label} className="p-4 rounded-2xl bg-base-card ring-1 ring-base-border">
            <p className="text-[23px] font-semibold tabular leading-none">{value}</p>
            <p className="text-[13.8px] text-ink-secondary mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <InsightCard insight={summary.insight} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by title, organization, or skill…" className="sm:w-72" />
        <div className="relative sm:ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none pl-3.5 pr-9 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border text-[14.9px] text-ink-primary outline-none focus:ring-accent-indigo/50"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                Sort: {s.label}
              </option>
            ))}
          </select>
          <ArrowUpDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none" />
        </div>
      </div>

      <div className="mb-6">
        <FilterBar active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Radar}
          title="No opportunities match these filters"
          description="Try a different filter or clear your search to see more results."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((o, i) => (
            <OpportunityCard key={o.id} opportunity={o} rank={i + 1} delay={Math.min(i, 6) * 0.04} />
          ))}
        </div>
      )}
    </div>
  )
}
