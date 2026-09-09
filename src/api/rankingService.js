import client, { USE_MOCKS } from './client'
import { mockOpportunities } from '../data/mockOpportunities'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export async function getRanking() {
  if (USE_MOCKS) {
    await delay()
    return [...mockOpportunities].sort((a, b) => b.finalScore - a.finalScore)
  }
  const { data } = await client.get('/ranking')
  return data
}

export async function recomputeRanking(profile) {
  if (USE_MOCKS) {
    await delay(400)
    return [...mockOpportunities].sort((a, b) => b.finalScore - a.finalScore)
  }
  const { data } = await client.post('/ranking', { profile })
  return data
}
