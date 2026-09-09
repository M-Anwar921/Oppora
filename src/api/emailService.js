import client, { USE_MOCKS } from './client'
import { mockOpportunities, mockAnalysisSummary } from '../data/mockOpportunities'

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms))

export async function getEmails() {
  if (USE_MOCKS) {
    await delay()
    return []
  }
  const { data } = await client.get('/emails')
  return data
}

export async function submitEmails(emails) {
  if (USE_MOCKS) {
    await delay()
    return { received: emails.length }
  }
  const { data } = await client.post('/emails', { emails })
  return data
}

// Kicks off AI analysis. In mock mode this simply resolves with the
// pre-baked ranked results after a short delay so the processing screen
// has something real to animate toward.
export async function analyzeEmails(emails) {
  if (USE_MOCKS) {
    await delay(600)
    return {
      opportunities: mockOpportunities,
      summary: { ...mockAnalysisSummary, emailsAnalyzed: emails?.length || mockAnalysisSummary.emailsAnalyzed },
    }
  }
  const { data } = await client.post('/emails/analyze', { emails })
  return data
}
