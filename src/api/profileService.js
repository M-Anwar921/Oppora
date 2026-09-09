import client, { USE_MOCKS } from './client'
import { mockProfile } from '../data/mockProfile'

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms))
const STORAGE_KEY = 'oic_profile'

function readStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export async function getProfile() {
  if (USE_MOCKS) {
    await delay()
    return readStoredProfile() || mockProfile
  }
  const { data } = await client.get('/profile')
  return data
}

export async function createProfile(profile) {
  if (USE_MOCKS) {
    await delay()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return profile
  }
  const { data } = await client.post('/profile', profile)
  return data
}

export async function updateProfile(profile) {
  if (USE_MOCKS) {
    await delay()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return profile
  }
  const { data } = await client.put('/profile', profile)
  return data
}
