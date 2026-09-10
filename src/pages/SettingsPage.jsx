import { Server, Database, RotateCcw } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import { API_BASE_URL, USE_MOCKS } from '../api/client'

export default function SettingsPage() {
  const handleReset = () => {
    localStorage.removeItem('oic_profile')
    localStorage.removeItem('oic_opportunities')
    sessionStorage.removeItem('oic_has_analyzed')
    window.location.href = '/'
  }

  return (
    <div>
      <PageHeader title="Settings" description="Connection details and local data for this demo build." />

      <div className="space-y-4 max-w-xl">
        <div className="p-5 rounded-2xl bg-base-card ring-1 ring-base-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/12 flex items-center justify-center">
              <Server size={15} className="text-accent-blue" />
            </div>
            <p className="text-[14px] font-semibold text-ink-primary">Backend connection</p>
          </div>
          <p className="text-[13px] text-ink-secondary mb-3">
            The frontend is API-ready and points at the FastAPI backend base URL below via{' '}
            <code className="text-accent-cyan">VITE_API_BASE_URL</code>.
          </p>
          <div className="px-3.5 py-2.5 rounded-lg bg-base-surface ring-1 ring-base-border text-[13px] font-mono text-ink-secondary">
            {API_BASE_URL}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-base-card ring-1 ring-base-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/12 flex items-center justify-center">
              <Database size={15} className="text-accent-cyan" />
            </div>
            <p className="text-[14px] font-semibold text-ink-primary">Data mode</p>
          </div>
          <p className="text-[13px] text-ink-secondary">
            Currently running on {USE_MOCKS ? 'realistic mock data' : 'the live backend'}. Flip{' '}
            <code className="text-accent-cyan">USE_MOCKS</code> in <code className="text-accent-cyan">src/api/client.js</code>{' '}
            once the backend is live — no component code needs to change.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-base-card ring-1 ring-base-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-state-danger/12 flex items-center justify-center">
              <RotateCcw size={15} className="text-state-danger" />
            </div>
            <p className="text-[14px] font-semibold text-ink-primary">Reset local data</p>
          </div>
          <p className="text-[13px] text-ink-secondary mb-4">
            Clears your saved profile and analysis results stored in this browser.
          </p>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg bg-state-danger/12 ring-1 ring-state-danger/30 text-state-danger text-[13px] font-medium hover:bg-state-danger/18 transition-colors"
          >
            Reset all local data
          </button>
        </div>
      </div>
    </div>
  )
}
