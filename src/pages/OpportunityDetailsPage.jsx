import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Bookmark, MapPin, Calendar, FileText, Wrench, Mail } from 'lucide-react'
import { useAppData } from '../context/AppDataContext'
import { PriorityBadge, TypeBadge } from '../components/common/Badge'
import { formatDeadline, urgencyLabel } from '../utils/format'
import ScoreBreakdown from '../components/opportunities/ScoreBreakdown'
import EvidenceCard from '../components/opportunities/EvidenceCard'
import ActionChecklist from '../components/opportunities/ActionChecklist'
import RankLowerExplainer from '../components/opportunities/RankLowerExplainer'
import ErrorState from '../components/common/ErrorState'

export default function OpportunityDetailsPage() {
  const { id } = useParams()
  const { opportunities, toggleChecklistItem } = useAppData()
  const [saved, setSaved] = useState(false)

  const opportunity = opportunities.find((o) => o.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!opportunity) {
    return (
      <ErrorState
        title="We couldn't find that opportunity"
        description="It may have been removed, or your inbox hasn't been analyzed yet."
      />
    )
  }

  const urgency = urgencyLabel(opportunity.deadline)
  const expired = urgency.tone === 'expired'

  return (
    <div>
      <Link to="/results" className="inline-flex items-center gap-1.5 text-[14.9px] text-ink-secondary hover:text-ink-primary transition-colors mb-6">
        <ArrowLeft size={16} /> Back to rankings
      </Link>

      {/* Header */}
      <div className="p-6 lg:p-8 rounded-3xl bg-base-card ring-1 ring-base-border mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <TypeBadge type={opportunity.type} />
          <PriorityBadge priority={opportunity.priority} />
        </div>
        <h1 className="text-[27.6px] lg:text-[32.2px] font-semibold tracking-tight text-ink-primary">{opportunity.title}</h1>
        <p className="text-[16.7px] text-ink-secondary mt-1.5">{opportunity.organization}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-[14.9px] text-ink-secondary">
          <span className="flex items-center gap-1.5">
            <MapPin size={16} className="text-ink-tertiary" /> {opportunity.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={16} className="text-ink-tertiary" /> {formatDeadline(opportunity.deadline)}
          </span>
          <span className={`flex items-center gap-1.5 font-medium ${expired ? 'text-state-danger' : urgency.tone === 'critical' ? 'text-state-critical' : 'text-ink-primary'}`}>
            {urgency.text}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={opportunity.applicationLink || '#'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-indigo hover:bg-accent-indigo/90 text-white text-[15.5px] font-medium transition-colors shadow-glow"
          >
            Apply Now <ExternalLink size={16} />
          </a>
          <button
            onClick={() => setSaved((s) => !s)}
            className={[
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[15.5px] font-medium ring-1 transition-colors',
              saved ? 'bg-accent-indigo/12 ring-accent-indigo/40 text-ink-primary' : 'bg-base-surface ring-base-border text-ink-secondary hover:text-ink-primary',
            ].join(' ')}
          >
            <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save Opportunity'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ScoreBreakdown opportunity={opportunity} />

          {/* Why this matches you */}
          <div className="p-6 rounded-2xl bg-base-card ring-1 ring-base-border">
            <h2 className="text-[17.2px] font-semibold text-ink-primary mb-4">Why this matches you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EvidenceCard title="Relevance" reasons={opportunity.reasons} />
              <EvidenceCard
                title="Skills match"
                reasons={opportunity.skills?.map((s) => `${s} — listed on your profile`)}
              />
            </div>
          </div>

          {(opportunity.priority === 'LOW' || opportunity.priority === 'MEDIUM') && opportunity.gaps && (
            <RankLowerExplainer gaps={opportunity.gaps} />
          )}

          {/* Eligibility & requirements */}
          <div className="p-6 rounded-2xl bg-base-card ring-1 ring-base-border space-y-6">
            <div>
              <h3 className="text-[15.5px] font-semibold text-ink-primary flex items-center gap-2 mb-3">
                <FileText size={17} className="text-accent-indigo" /> Eligibility
              </h3>
              {opportunity.eligibility?.length ? (
                <ul className="space-y-1.5">
                  {opportunity.eligibility.map((e) => (
                    <li key={e} className="text-[14.9px] text-ink-secondary flex items-start gap-2">
                      <span className="text-state-success mt-0.5">✓</span> {e}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[14.9px] text-ink-tertiary">Not specified in the email</p>
              )}
            </div>

            <div>
              <h3 className="text-[15.5px] font-semibold text-ink-primary flex items-center gap-2 mb-3">
                <FileText size={17} className="text-accent-indigo" /> Required documents
              </h3>
              {opportunity.requiredDocuments?.length ? (
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredDocuments.map((d) => (
                    <span key={d} className="px-2.5 py-1 rounded-lg bg-base-surface ring-1 ring-base-border text-[13.8px] text-ink-secondary">
                      {d}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[14.9px] text-ink-tertiary">Not specified in the email</p>
              )}
            </div>

            <div>
              <h3 className="text-[15.5px] font-semibold text-ink-primary flex items-center gap-2 mb-3">
                <Wrench size={17} className="text-accent-indigo" /> Required skills
              </h3>
              {opportunity.skills?.length ? (
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-base-surface ring-1 ring-base-border text-[13.8px] text-ink-secondary">
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[14.9px] text-ink-tertiary">Not specified in the email</p>
              )}
            </div>

            <div>
              <h3 className="text-[15.5px] font-semibold text-ink-primary flex items-center gap-2 mb-3">
                <Mail size={17} className="text-accent-indigo" /> Application information
              </h3>
              <div className="text-[14.9px] text-ink-secondary space-y-1">
                <p>Contact: {opportunity.contactEmail || 'Not specified in the email'}</p>
                <p className="truncate">Link: {opportunity.applicationLink || 'Not specified in the email'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ActionChecklist
            items={opportunity.actionChecklist}
            onToggle={(i) => toggleChecklistItem(opportunity.id, i)}
          />
        </div>
      </div>
    </div>
  )
}
