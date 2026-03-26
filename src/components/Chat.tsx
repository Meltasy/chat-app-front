import { useState, useEffect } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { getMessages, sendMessage, renameChat } from '../api.ts'
import type { User } from '../utils/authenticate.ts'
import ChatHeader from './ChatHeader.tsx'
import MessageList from './MessageList.tsx'
import MessageInput from './MessageInput.tsx'
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

  // Should I move the useEffect into a CustomHook?

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
      <ChatHeader
        chatName={chatName}
        isGroup={isGroup}
        isAdmin={isAdmin}
        renaming={renaming}
        newName={newName}
        onNewNameChange={setNewName}
        onRenameSubmit={handleRename}
        onRenameStart={() => setRenaming(true)}
        onRenameCancel={() => setRenaming(false)}
      />
      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button onClick={() => setError(null)} className={styles.button}>
            X
          </button>
        </div>
      )}
      <MessageList messages={messages} />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSend}
      />
    </div>
  )
}

export default Chat
