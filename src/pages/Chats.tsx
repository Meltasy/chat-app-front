import { useState, useEffect } from 'react'
import { Outlet, useOutletContext, NavLink } from 'react-router-dom'
import { getChats, type ChatPreview } from '../api.ts'
import type { User } from '../utils/authenticate.ts'
import styles from '../assets/pages/Chats.module.css'

function Chats() {
  const { user } = useOutletContext<{ user: User | null }>()
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h4>Your chats, {user.username}!</h4>
        <ul>
          <li>
            <NavLink
              to='/chats/new'
              className={({ isActive }) =>
                isActive ? `${styles.button} ${styles.active}` : styles.button
              }
            >
              Create Chat
            </NavLink>
          </li>
        </ul>

        {loading && <p>Loading chats...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          chats.length === 0 ? (
            <p>You have no chats yet.</p>
          ) : (
            <ul>
              {chats.map(chat => (
                <li key={chat.id}>
                  <NavLink
                    to={`/chats/${chat.id}`}
                    className={({ isActive }) =>
                      isActive ? `${styles.chatItem} ${styles.active}` : styles.chatItem
                    }
                  >
                    <strong>{chat.name}</strong>
                    <p>{chat.messages[0]?.text ?? 'No messages yet.'}</p>
                  </NavLink>
                </li>
              ))}
            </ul>
          )
        )}
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Chats