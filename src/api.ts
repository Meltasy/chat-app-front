import { getUserHeader } from './utils/authenticate'

// When sending messages add sender: { id: string } here and in backend

const API_URL = import.meta.env.VITE_BACKEND_URL

interface UserResponse {
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
  lastMessage: {
    text: string
    sentAt: string
    sender: { username: string }
  } | null
}

interface AllChatsResponse {
  success: boolean
  message: string
  chats?: ChatPreview[]
}

interface AllUsersResponse {
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

interface ChatResponse {
  success: boolean
  message: string
}

interface GetMessageResponse {
  success: boolean
  message: string
  chat?: {
    id: string
    name: string | null
    isGroup: boolean
    members: { id: string, username: string, role: string }[]
    messages: {
      id: string
      text: string
      sentAt: string
      sender: { username: string }
    }[]
  }
}

interface MessageResponse {
  success: boolean
  message: string
  data?: {
    id: string
    text: string
    sentAt: string
    sender: { username: string }
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

async function register(username: string, email: string, password: string): Promise<UserResponse> {
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

async function login(email: string, password: string): Promise<UserResponse> {
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

async function getAllChats(): Promise<AllChatsResponse> {
  const response = await fetch(`${API_URL}/chats/`, {
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

async function getAllUsers(): Promise<AllUsersResponse> {
  const response = await fetch(`${API_URL}/user/allUsers`, {
    method: 'GET',
    headers: userHeader()
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to fetch users: ${response.status}`)
  }
  return response.json()
}

async function createChat(members: string[], name?: string): Promise<CreateChatResponse> {
  const response = await fetch(`${API_URL}/chats/newChat`, {
    mode: 'cors',
    method: 'POST',
    headers: userHeader(),
    body: JSON.stringify({ members, ...(name && { name }) })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to create chat: ${response.status}`)
  }
  return response.json()
}

async function renameChat(chatId: string, name: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/name`, {
    mode: 'cors',
    method: 'PATCH',
    headers: userHeader(),
    body: JSON.stringify({ name })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to rename chat: ${response.status}`)
  }
  return response.json()
}

async function deleteChat(chatId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    mode: 'cors',
    method: 'DELETE',
    headers: userHeader(),
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to delete chat: ${response.status}`)
  }
  return response.json()
}

async function addMember(chatId: string, userId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/members`, {
    mode: 'cors',
    method: 'POST',
    headers: userHeader(),
    body: JSON.stringify({ userId })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to add member: ${response.status}`)
  }
  return response.json()
}

async function removeMember(chatId: string, userId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/members/${userId}`, {
    mode: 'cors',
    method: 'DELETE',
    headers: userHeader(),
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to remove member: ${response.status}`)
  }
  return response.json()
}

async function getMessages(chatId: string): Promise<GetMessageResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    mode: 'cors',
    method: 'GET',
    headers: userHeader()
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to fetch messages: ${response.status}`)
  }
  return response.json()
}

async function sendMessage(chatId: string, text: string): Promise<MessageResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    mode: 'cors',
    method: 'POST',
    headers: userHeader(),
    body: JSON.stringify({ text })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to send message: ${response.status}`)
  }
  return response.json()
}

async function updateMessage(chatId: string, messageId: string, text: string): Promise<MessageResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages/${messageId}`, {
    mode: 'cors',
    method: 'PATCH',
    headers: userHeader(),
    body: JSON.stringify({ text })
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to update message: ${response.status}`)
  }
  return response.json()
}

async function deleteMessage(chatId: string, messageId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages/${messageId}`, {
    mode: 'cors',
    method: 'DELETE',
    headers: userHeader(),
  })
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json()
    throw new Error(errorData.message || `Failed to delete message: ${response.status}`)
  }
  return response.json()
}

export type {
  UserResponse,
  ChatPreview,
  AllChatsResponse,
  AllUsersResponse,
  CreateChatResponse,
  ChatResponse,
  GetMessageResponse,
  MessageResponse,
  ErrorResponse
}

export {
  register,
  login,
  getAllChats,
  getAllUsers,
  createChat,
  renameChat,
  addMember,
  removeMember,
  deleteChat,
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage
}
