import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getProfile, createProfile as saveProfile } from '../api/profileService'
import { analyzeEmails } from '../api/emailService'
import { getOpportunities, updateOpportunityChecklist, persistOpportunities } from '../api/opportunityService'
import { computeProfileCompleteness, mockProfile } from '../data/mockProfile'
import { mockAnalysisSummary } from '../data/mockOpportunities'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [profile, setProfile] = useState(mockProfile)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [opportunities, setOpportunities] = useState([])
  const [summary, setSummary] = useState(mockAnalysisSummary)
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [lastEmails, setLastEmails] = useState([])

  useEffect(() => {
    getProfile().then((p) => {
      setProfile(p)
      setProfileLoaded(true)
    })
    getOpportunities().then((list) => {
      if (list?.length) {
        setOpportunities(list)
      }
    })
    const flag = sessionStorage.getItem('oic_has_analyzed')
    if (flag) setHasAnalyzed(true)
  }, [])

  const profileCompleteness = computeProfileCompleteness(profile)

  const persistProfile = useCallback(async (updated) => {
    setProfile(updated)
    await saveProfile(updated)
  }, [])

  const runAnalysis = useCallback(async (emails) => {
    setIsAnalyzing(true)
    setLastEmails(emails)
    try {
      const result = await analyzeEmails(emails)
      setOpportunities(result.opportunities)
      setSummary(result.summary)
      persistOpportunities(result.opportunities)
      setHasAnalyzed(true)
      sessionStorage.setItem('oic_has_analyzed', '1')
      return result
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const toggleChecklistItem = useCallback(async (opportunityId, itemIndex) => {
    setOpportunities((prev) => {
      const next = prev.map((o) => {
        if (o.id !== opportunityId) return o
        const actionChecklist = o.actionChecklist.map((item, i) =>
          i === itemIndex ? { ...item, completed: !item.completed } : item
        )
        updateOpportunityChecklist(opportunityId, actionChecklist)
        return { ...o, actionChecklist }
      })
      return next
    })
  }, [])

  const value = {
    profile,
    profileLoaded,
    profileCompleteness,
    persistProfile,
    opportunities,
    summary,
    hasAnalyzed,
    isAnalyzing,
    lastEmails,
    runAnalysis,
    toggleChecklistItem,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
