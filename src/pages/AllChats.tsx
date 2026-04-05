import { Outlet, useOutletContext, NavLink, useParams } from 'react-router-dom'
import type { User } from '../utils/authenticate.ts'
import { useAllChats } from '../hooks/useAllChats.ts'
import { useChatListSocket } from '../hooks/useChatListSocket.ts'
import { MessageCirclePlus } from 'lucide-react'
import styles from '../assets/pages/AllChats.module.css'

function AllChats() {
  const { user } = useOutletContext<{ user: User | null }>()
  const { chats, setChats, error, loading } = useAllChats(user)
  const { chatId } = useParams<{chatId?: string}>()

  useChatListSocket(chatId, chats, setChats)

  if (!user) return null

  return (
    <div className={styles.wrapper}>
      <aside className={styles.aside}>
        <NavLink
          to='/chats/new'
          className={({ isActive }) =>
            isActive ? `${styles.listLink} ${styles.activeLink}` : styles.listLink
          }
        >
          <p className={styles.newChat}>
            <MessageCirclePlus />
            <span>New Chat</span>
          </p>
        </NavLink>
        <div className={styles.chatSection}>
          <h4>Your chats, {user.username}!</h4>
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
                        isActive ? `${styles.listLink} ${styles.activeLink}` : styles.listLink
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
        </div>
      </aside>
      <main>
        <Outlet context={{ user }} />
      </main>
    </div>
  )
}

export default AllChats
