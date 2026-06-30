import { API_URL, userHeader, handleResponse } from './shared'

export interface AllUsersResponse {
  success: boolean
  message: string
  users?: { id: string, username: string }[]
}

export async function getAllUsers(): Promise<AllUsersResponse> {
  const response = await fetch(`${API_URL}/user/allUsers`, {
    method: 'GET',
    headers: userHeader()
  })
  return handleResponse(response)
}
