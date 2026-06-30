import { API_URL, userHeader, handleResponse } from './shared'
import type { ChatResponse } from './chats'

export interface GetMessagesResponse {
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
      sender: { id: string, username: string }
    }[]
  }
  hasMore?: boolean
}

export interface MessageResponse {
  success: boolean
  message: string
  data?: {
    id: string
    text: string
    sentAt: string
    sender: { id: string, username: string }
  }
}

export async function getMessages(chatId: string, cursor?: string): Promise<GetMessagesResponse> {
  const params = cursor ? `?cursor=${cursor}&limit=30` : '?limit=30'
  const response = await fetch(`${API_URL}/chats/${chatId}/messages${params}`, {
    mode: 'cors',
    method: 'GET',
    headers: userHeader()
  })
  return handleResponse(response)
}

export async function sendMessage(chatId: string, text: string): Promise<MessageResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    mode: 'cors',
    method: 'POST',
    headers: userHeader(),
    body: JSON.stringify({ text })
  })
  return handleResponse(response)
}

export async function updateMessage(chatId: string, messageId: string, text: string): Promise<MessageResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages/${messageId}`, {
    mode: 'cors',
    method: 'PATCH',
    headers: userHeader(),
    body: JSON.stringify({ text })
  })
  return handleResponse(response)
}

export async function deleteMessage(chatId: string, messageId: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages/${messageId}`, {
    mode: 'cors',
    method: 'DELETE',
    headers: userHeader(),
  })
  return handleResponse(response)
}
