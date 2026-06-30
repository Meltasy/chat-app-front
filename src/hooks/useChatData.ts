import { useState, useEffect } from 'react'
import { getMessages } from '../api/messages.ts'
import socket from '../utils/socket.ts'
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
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(true)

  const loadOlderMessages = async () => {
    if (!chatId || loadingMore || !hasMore || messages.length === 0) return
    setLoadingMore(true)
    try {
      const oldestId = messages[0].id
      const data = await getMessages(chatId, oldestId)
      if (data.success && data.chat) {
        setMessages(prev => [...data.chat!.messages, ...prev])
        setHasMore(data.hasMore ?? false)
      }
    } catch {
      setError('Failed to load older messages.')
    } finally {
      setLoadingMore(false)
    }
  }

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
          setHasMore(data.hasMore ?? false)
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

  useEffect(() => {
    const handleRoleUpdated = ({ userId, role }: { userId: string, role: string }) => {
      setMembers(prev => prev.map(m => m.id === userId ? { ...m, role } : m))
    }
    socket.on('member_role_updated', handleRoleUpdated)
    return () => { socket.off('member_role_updated', handleRoleUpdated)}
  }, [])

  return { messages, setMessages, members, setMembers, chatName, setChatName, isGroup, 
    hasMore, loadingMore, loadOlderMessages, chatLoading, error, setError }
}
