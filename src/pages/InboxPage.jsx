import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Plus, Wand2 } from 'lucide-react'
import PageHeader from '../components/common/PageHeader'
import EmailInputCard from '../components/inbox/EmailInputCard'
import EmailUpload from '../components/inbox/EmailUpload'
import { createEmptyEmail, demoInboxEmails } from '../data/mockEmails'
import { useAppData } from '../context/AppDataContext'

const MAX_EMAILS = 15
const MIN_EMAILS = 5

export default function InboxPage() {
  const navigate = useNavigate()
  const { runAnalysis, isAnalyzing } = useAppData()
  const [tab, setTab] = useState('paste')
  const [emails, setEmails] = useState([createEmptyEmail()])
  const [files, setFiles] = useState([])

  const updateEmail = (id, updated) => setEmails((prev) => prev.map((e) => (e.id === id ? updated : e)))
  const removeEmail = (id) => setEmails((prev) => prev.filter((e) => e.id !== id))
  const addEmail = () => {
    if (emails.length >= MAX_EMAILS) return
    setEmails((prev) => [...prev, createEmptyEmail()])
  }
  const loadDemo = () => setEmails(demoInboxEmails)

  const filledEmails = emails.filter((e) => e.sender || e.subject || e.body)
  const readyCount = tab === 'paste' ? filledEmails.length : files.length

  const handleAnalyze = async () => {
    navigate('/analyzing')
    await runAnalysis(tab === 'paste' ? filledEmails : files.map((f) => ({ sender: f.name, subject: f.name, body: '' })))
    navigate('/results')
  }

  return (
    <div>
      <PageHeader
        title="Opportunity Inbox"
        description="Bring your ignored emails. We'll help you discover what matters."
      />

      <div className="flex items-center gap-2 mb-6 p-1 rounded-xl bg-base-surface ring-1 ring-base-border w-fit">
        {[
          { id: 'paste', label: 'Paste Emails' },
          { id: 'upload', label: 'Upload Files' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'px-4 py-2 rounded-lg text-[13.5px] font-medium transition-colors',
              tab === t.id ? 'bg-base-card text-ink-primary shadow-card' : 'text-ink-secondary hover:text-ink-primary',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'paste' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-ink-secondary tabular">
              Emails added: {filledEmails.length} / {MAX_EMAILS}
            </p>
            <button
              onClick={loadDemo}
              className="inline-flex items-center gap-1.5 text-[13px] text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              <Wand2 size={14} /> Load Demo Inbox
            </button>
          </div>

          <div className="space-y-4">
            {emails.map((email, i) => (
              <motion.div key={email.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <EmailInputCard
                  email={email}
                  index={i}
                  onChange={(updated) => updateEmail(email.id, updated)}
                  onRemove={() => removeEmail(email.id)}
                />
              </motion.div>
            ))}
          </div>

          {emails.length < MAX_EMAILS && (
            <button
              onClick={addEmail}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-base-border hover:border-base-borderStrong text-[13.5px] text-ink-secondary hover:text-ink-primary transition-colors"
            >
              <Plus size={15} /> Add Another Email
            </button>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={loadDemo}
              className="inline-flex items-center gap-1.5 text-[13px] text-accent-cyan hover:text-accent-cyan/80 transition-colors"
            >
              <Wand2 size={14} /> Load Demo Inbox
            </button>
          </div>
          <EmailUpload
            files={files}
            onFilesAdded={(newFiles) => setFiles((prev) => [...prev, ...newFiles].slice(0, MAX_EMAILS))}
            onFileRemoved={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </div>
      )}

      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-accent-indigo/10 via-base-card to-base-card ring-1 ring-accent-indigo/20 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div>
          <p className="text-[13px] text-ink-secondary">
            {readyCount < MIN_EMAILS
              ? `Add at least ${MIN_EMAILS} emails for the strongest analysis (${readyCount} ready).`
              : 'AI will identify opportunities, extract important details, and personalize your results.'}
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={readyCount === 0 || isAnalyzing}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent-indigo hover:bg-accent-indigo/90 disabled:opacity-50 text-white text-[14.5px] font-medium shadow-glow transition-colors whitespace-nowrap"
        >
          <Sparkles size={16} strokeWidth={2} />
          Analyze Inbox with AI
        </button>
      </div>
    </div>
  )
}
