import { useState, useEffect } from 'react'
import { getMessages } from '../api.ts'
import type { User } from '../utils/authenticate.ts'

export function useChatData(chatId: string | undefined, user: User | null) {
  const [messages, setMessages] = useState<{
    id: string, text: string, sentAt: string, sender: { id: string, username: string }
  }[]>([])
  const [members, setMembers] = useState<{
    id: string, username: string, role: string
  }[]>([])
  const [chatName, setChatName] = useState('')
  const [isGroup, setIsGroup] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(true)

  useEffect(() => {
    if (!chatId || !user) return
    const fetchChat = async () => {
      try {
        const data = await getMessages(chatId)
        if (data.success && data.chat) {
          setMessages(data.chat.messages)
          setMembers(data.chat.members)
          setChatName(data.chat.name ?? '')
          setIsGroup(data.chat.isGroup)
        } else {
          setError(data.message)
        }
      } catch {
        setError('Failed to load chat.')
      } finally {
        setChatLoading(false)
      }
    }
    fetchChat()
  }, [chatId, user])

  return { messages, setMessages, members, setMembers, chatName, 
    setChatName, isGroup, chatLoading, error, setError }
}
