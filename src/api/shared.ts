import { getUserHeader } from '../utils/authenticate'

export const API_URL = import.meta.env.VITE_BACKEND_URL

export interface ErrorResponse {
  success: false
  message: string
  error?: string
}

export const header = (): HeadersInit => ({
  'Content-type': 'application/json'
})

export const userHeader = (): HeadersInit => ({
  ...header(),
  ...getUserHeader()
})

export async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/'
    throw new Error('Session expired')
  }
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Request failed: ${response.status}`)
  }
  return response.json()
}
