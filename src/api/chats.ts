import { API_URL, userHeader, handleResponse } from './shared'

export interface ChatPreview {
  id: string
  name: string
  members: { id: string, username: string, role: string }[]
  lastMessage: {
    id: string
    text: string
    sentAt: string
    sender: { username: string }
  } | null
}

export interface AllChatsResponse {
  success: boolean
  message: string
  chats?: ChatPreview[]
}

export interface CreateChatResponse {
  success: boolean
  message: string
  chat?: {
    id: string
    name: string | null
    isGroup: boolean
  }
}

export interface ChatResponse {
  success: boolean
  message: string
}

export async function getAllChats(): Promise<AllChatsResponse> {
  const response = await fetch(`${API_URL}/chats/`, {
    mode: 'cors',
    method: 'GET',
    headers: userHeader()
  })
  return handleResponse(response)
}

export async function createChat(members: string[], name?: string): Promise<CreateChatResponse> {
  const response = await fetch(`${API_URL}/chats/newChat`, {
    mode: 'cors',
    method: 'POST',
    headers: userHeader(),
    body: JSON.stringify({ members, ...(name && { name }) })
  })
  return handleResponse(response)
}

export async function renameChat(chatId: string, name: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/name`, {
    mode: 'cors',
    method: 'PATCH',
    headers: userHeader(),
    body: JSON.stringify({ name })
  })
  return handleResponse(response)
}

export async function deleteChat(chatId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    mode: 'cors',
    method: 'DELETE',
    headers: userHeader(),
  })
  return handleResponse(response)
}

export async function addMember(chatId: string, userId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/members`, {
    mode: 'cors',
    method: 'POST',
    headers: userHeader(),
    body: JSON.stringify({ userId })
  })
  return handleResponse(response)
}

export async function updateMemberRole(chatId: string, userId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/members/${userId}/role`, {
    mode: 'cors',
    method: 'PATCH',
    headers: userHeader(),
  })
  return handleResponse(response)
}

export async function removeMember(chatId: string, userId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/members/${userId}`, {
    mode: 'cors',
    method: 'DELETE',
    headers: userHeader(),
  })
  return handleResponse(response)
}
