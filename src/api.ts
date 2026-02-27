import { getUserHeader } from './utils/authenticate'

const API_URL = import.meta.env.VITE_BACKEND_URL

interface RegisterResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    userId: string
    username: string
    email: string
  }
}

interface LoginResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    userId: string
    username: string
    email: string
  }
}

interface ChatPreview {
  id: string
  name: string
  members: { id: string, username: string, role: string }[]
  messages: { text: string, sentAt: string, sender: { username: string } }[]
}

interface ChatsResponse {
  success: boolean
  message: string
  chats?: ChatPreview[]
}

interface UsersResponse {
  success: boolean
  message: string
  users?: { id: string, username: string }[]
}

interface CreateChatResponse {
  success: boolean
  message: string
  chat?: {
    id: string
    name: string | null
    isGroup: boolean
  }
}

interface ErrorResponse {
  success: false
  message: string
  error?: string
}

const header = (): HeadersInit => ({
  'Content-type': 'application/json'
})

const userHeader = (): HeadersInit => ({
  ...header(),
  ...getUserHeader()
})

async function register(
  username: string,
  email: string,
  password: string
): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/index/register`, {
    mode: 'cors',
    method: 'POST',
    headers: header(),
    body: JSON.stringify({ username, email, password })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to register: $(response.status)`)
  }
  return response.json()
}

async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/index/login`, {
    mode: 'cors',
    method: 'POST',
    headers: header(),
    body: JSON.stringify({ email, password })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to log in: ${response.status}`)
  }
  return response.json()
}

async function getChats(userId: string): Promise<ChatsResponse> {
  const response = await fetch(`${API_URL}/user/${userId}/chats`, {
    mode: 'cors',
    method: 'GET',
    headers: userHeader()
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to fetch chats: ${response.status}`)
  }
  return response.json()
}

async function getAllUsers(): Promise<UsersResponse> {
  const response = await fetch(`${API_URL}/user`, {
    method: 'GET',
    headers: userHeader()
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to fetch users: ${response.status}`)
  }
  return response.json()
}

async function createChat(members: string[]): Promise<CreateChatResponse> {
  const response = await fetch(`${API_URL}/chats/new`, {
    mode: 'cors',
    method: 'POST',
    headers: userHeader(),
    body: JSON.stringify({ members })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to create chat: ${response.status}`)
  }
  return response.json()
}

export type {
  RegisterResponse,
  LoginResponse,
  ChatPreview,
  ChatsResponse,
  ErrorResponse
}

export {
  register,
  login,
  getChats,
  getAllUsers,
  createChat
}
