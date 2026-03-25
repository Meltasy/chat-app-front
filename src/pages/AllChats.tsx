import { useState, useEffect } from 'react'
import { Outlet, useOutletContext, NavLink } from 'react-router-dom'
import { getAllChats, type ChatPreview } from '../api.ts'
import type { User } from '../utils/authenticate.ts'
import styles from '../assets/pages/AllChats.module.css'

function AllChats() {
  const { user } = useOutletContext<{ user: User | null }>()
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

  if (!user) return null

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <h4>Your chats, {user.username}!</h4>
        <NavLink
          to='/chats/new'
          className={({ isActive }) =>
            isActive ? `${styles.button} ${styles.activeBtn}` : styles.button
          }
        >
          Create Chat
        </NavLink>
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
                      isActive ? `${styles.chatItem} ${styles.activeChat}` : styles.chatItem
                    }
                  >
                    <strong>{chat.name}</strong>
                    <p>{chat.lastMessage?.text ?? 'No messages yet.'}</p>
                  </NavLink>
                </li>
              ))}
            </ul>
          )
        )}
      </aside>
      <main className={styles.main}>
        <Outlet context={{ user }} />
      </main>
    </div>
  )
}

export default AllChats