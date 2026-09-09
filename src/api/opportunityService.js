import client, { USE_MOCKS } from './client'
import { mockOpportunities } from '../data/mockOpportunities'

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))
const STORAGE_KEY = 'oic_opportunities'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function persistOpportunities(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export async function getOpportunities() {
  if (USE_MOCKS) {
    await delay()
    return readStored() || mockOpportunities
  }
  const { data } = await client.get('/opportunities')
  return data
}

export async function getOpportunityById(id) {
  if (USE_MOCKS) {
    await delay()
    const list = readStored() || mockOpportunities
    return list.find((o) => o.id === id) || null
  }
  const { data } = await client.get(`/opportunities/${id}`)
  return data
}

export async function updateOpportunityChecklist(id, actionChecklist) {
  if (USE_MOCKS) {
    await delay(150)
    const list = readStored() || mockOpportunities
    const updated = list.map((o) => (o.id === id ? { ...o, actionChecklist } : o))
    persistOpportunities(updated)
    return updated.find((o) => o.id === id)
  }
  const { data } = await client.put(`/opportunities/${id}`, { actionChecklist })
  return data
}
