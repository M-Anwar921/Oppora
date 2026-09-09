import axios from 'axios'

// Centralized Axios instance. Swap USE_MOCKS to false once the FastAPI
// backend at VITE_API_BASE_URL is live — every service function below
// already calls through this client, so no component code has to change.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const USE_MOCKS = true

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong talking to the server.'
    return Promise.reject({ ...error, message })
  }
)

export default client
