import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Radar } from 'lucide-react'
import AnalysisStepItem from '../components/inbox/AnalysisStepItem'
import { useAppData } from '../context/AppDataContext'

const STEPS = [
  'Reading your inbox',
  'Detecting genuine opportunities',
  'Extracting deadlines and requirements',
  'Matching your student profile',
  'Calculating opportunity scores',
  'Ranking your opportunities',
  'Building your action plan',
]

const STEP_DURATION = 480

export default function AnalyzingPage() {
  const navigate = useNavigate()
  const { isAnalyzing, hasAnalyzed, lastEmails } = useAppData()
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (lastEmails.length === 0 && !isAnalyzing && !hasAnalyzed) {
      navigate('/inbox')
    }
  }, [lastEmails, isAnalyzing, hasAnalyzed, navigate])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, STEPS.length))
    }, STEP_DURATION)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-base-card ring-1 ring-base-border flex items-center justify-center mb-6"
          >
            <Radar size={30} className="text-accent-cyan" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-[25.3px] font-semibold tracking-tight">Analyzing your inbox</h1>
          <p className="text-[15.5px] text-ink-secondary mt-2">
            This usually takes a few seconds — we're reading closely so your rankings are accurate.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-base-card ring-1 ring-base-border space-y-5">
          {STEPS.map((label, i) => (
            <AnalysisStepItem
              key={label}
              label={label}
              status={i < activeStep ? 'done' : i === activeStep ? 'active' : 'pending'}
              delay={i * 0.03}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
