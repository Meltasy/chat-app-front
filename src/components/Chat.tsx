import { useState, useEffect, useRef } from 'react'
import { useParams, useOutletContext } from 'react-router-dom'
import { getChatMessages, sendChatMessage, renameChat } from '../api.ts'
import type { User } from '../utils/authenticate.ts'

function Chat() {
  const { chatId } = useParams<{ chatId: string }>()
  const { user } = useOutletContext<{ user: User | null }>()
  const [messages, setMessages] = useState<{ text: string, sentAt: string, sender: { username: string } }[]>([])
  const [members, setMembers] = useState<{ id: string, username: string, role: string }[]>([])
  const [chatName, setChatName] = useState('')
  const [isGroup, setIsGroup] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [newName, setNewName] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatLoading, setChatLoading] = useState(true)

  const isAdmin = members.find(m => m.id === user?.id)?.role === 'ADMIN'
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chatId || !user) return
    const fetchChat = async () => {
      try {
        const data = await getChatMessages(chatId)
        if (data.success) {
          setMessages(data.chat.messages)
          setMembers(data.members)
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const trimmedMessage = newMessage.trim()
    if (!trimmedMessage || !chatId) return
    try {
      const data = await sendChatMessage(chatId, trimmedMessage)
      if (data.success) {
        setMessages(prev => [...prev, data.data])
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
  if (error) return <p>{error}</p>

  return (
    <div>
      <div>
        <h2>{chatName}</h2>
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
              <button onClick={handleRename} disabled={!newName.trim()}>Save</button>
              <button onClick={() => setRenaming(false)}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setRenaming(true)}>Rename</button>
          )
        )}
      </div>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <strong>{msg.sender.username}</strong>: {msg.text}
          </li>
        ))}
      </ul>
      <div ref={bottomRef} />
      <div>
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder='Type a message...'
        />
        <button onClick={handleSend} disabled={!newMessage.trim()}>Send</button>
      </div>
    </div>
  )
}

export default Chat
