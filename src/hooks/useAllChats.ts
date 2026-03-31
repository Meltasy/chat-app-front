import { useState, useEffect } from 'react'
import { getAllChats, type ChatPreview } from '../api'
import type { User } from '../utils/authenticate'

export function useAllChats(user: User | null) {
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

    useEffect(() => {
    if (!user) return
    const fetchChats = async () => {
      try {
        const data = await getAllChats()
        if (data.success && data.chats) {
          setChats(data.chats)
        } else {
          setError(data.message)
        }
      } catch {
        setError('Failed to load chats.')
      } finally {
        setLoading(false)
      }
    }
    fetchChats()
  }, [user])

  return { chats, error, loading }
}
