import { useState, useEffect } from 'react'
// import { useRef } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { getMessages, sendMessage, renameChat } from '../api.ts'
import type { User } from '../utils/authenticate.ts'
import styles from '../assets/components/Chat.module.css'

// Add options to (ADMIN only) deleteChat, addMemeber, removeMember, (MEMBER's own only) editMessage, deleteMessage

function Chat() {
  const { chatId } = useParams<{ chatId: string }>()
  const { user } = useOutletContext<{ user: User | null }>()
  const [messages, setMessages] = useState<{
    id: string, text: string, sentAt: string, sender: { username: string }
  }[]>([])
  const [members, setMembers] = useState<{
    id: string, username: string, role: string
  }[]>([])
  const [chatName, setChatName] = useState('')
  const [isGroup, setIsGroup] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [newName, setNewName] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(true)

  const isAdmin = members?.find(m => m.id === user?.id)?.role === 'ADMIN'
  // const bottomRef = useRef<HTMLDivElement>(null)

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

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }, [messages])

  const handleSend = async () => {
    const trimmedMessage = newMessage.trim()
    if (!trimmedMessage || !chatId) return
    try {
      const data = await sendMessage(chatId, trimmedMessage)
      if (data.success && data.data) {
        setMessages(prev => [...prev, data.data!])
        setNewMessage('')
      }
    } catch {
      setError('Failed to send message.')
    }
  }

  const handleRename = async () => {
    const trimmedName = newName.trim()
    if (!trimmedName || !chatId) return
    try {
      const data = await renameChat(chatId, trimmedName)
      if (data.success) {
        setChatName(trimmedName)
        setNewName('')
        setRenaming(false)
      }
    } catch {
      setError('Failed to rename chat.')
    }
  }

  if (chatLoading) return <p>Loading chat...</p>
  if (error && messages.length === 0) return <p>{error}</p>
  // Replace X (error) with icon/emoji

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.wrapperDiv} ${styles.buttonDiv}`}>
        <h4 className={styles.groupName}>{chatName}</h4>
        {isGroup && isAdmin && (
          renaming ? (
            <div>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder={chatName}
                minLength={5}
                maxLength={100}
              />
              <button
                onClick={handleRename}
                disabled={!newName.trim()}
                className={styles.button}
              >
                Save
              </button>
              <button
                onClick={() => setRenaming(false)}
                className={styles.button}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setRenaming(true)}
              className={styles.button}
            >
              Rename
            </button>
          )
        )}
      </div>
      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button
            onClick={() => setError(null)}
            className={styles.button}
          >
            X
          </button>
        </div>
      )}
      <ul className={styles.wrapperDiv}>
        {messages.map((msg) => (
          <li key={msg.id} className={styles.messageItem}>
            <strong>{msg.sender.username}</strong>: {msg.text}
          </li>
        ))}
      </ul>
      {/* <div ref={bottomRef} /> */}
      <div className={`${styles.wrapperDiv} ${styles.buttonDiv}`}>
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder='Type a message...'
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className={styles.button}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
