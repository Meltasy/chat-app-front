import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import type { User } from '../utils/authenticate.ts'
import { getChats, type ChatPreview } from '../api.ts'

function Chats() {
  const { user } = useOutletContext<{ user: User | null }>()
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const fetchChats = async () => {
      try {
        const data = await getChats(user.id)
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

  if (!user) return null
  if (loading) return <p>Loading chats...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Your chats, {user.username}!</h1>
      <button onClick={() => navigate('/chats/new')}>Create Chat</button>
      {chats.length === 0 ? (
        <p>You have no chats yet.</p>
      ) : (
        <ul>
          {chats.map(chat => (
            <li key={chat.id} onClick={() => navigate(`/chats/${chat.id}`)}>
              <strong>{chat.name}</strong>
              <p>{chat.messages[0]?.text ?? 'No messages yet.'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Chats