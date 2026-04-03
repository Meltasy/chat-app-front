import { useEffect, useState } from 'react'
import { useParams, useOutletContext, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket.ts'
import { sendMessage, renameChat, deleteChat, addMember, removeMember, 
  deleteMessage } from '../api.ts'
import type { User } from '../utils/authenticate.ts'
import { useChatData } from '../hooks/useChatData.ts'
import { useMessageEditing } from '../hooks/useMessageEditing.ts'
import { useAllUsers } from '../hooks/useAllUsers.ts'
import { X } from 'lucide-react'
import ChatHeader from './ChatHeader.tsx'
import MessageList from './MessageList.tsx'
import MessageInput from './MessageInput.tsx'
import styles from '../assets/components/Chat.module.css'

function Chat() {
  const { chatId } = useParams<{ chatId: string }>()
  const { user } = useOutletContext<{ user: User | null }>()
  const { messages, setMessages, members, setMembers, chatName, setChatName, 
    isGroup, chatLoading, error, setError } = useChatData(chatId, user)
  const { editingMessageId, editingText, setEditingText, startEditing, cancelEditing, 
    handleEditMessage } = useMessageEditing(chatId, setMessages, setError)
  const navigate = useNavigate()
  const [newMessage, setNewMessage] = useState('')
  const [newName, setNewName] = useState('')
  const [renaming, setRenaming] = useState(false)

  const isAdmin = members?.find(m => m.id === user?.id)?.role === 'ADMIN'
  const { allUsers } = useAllUsers(isAdmin)

  useSocket(chatId, setMessages, user?.id)

  useEffect(() => {
    if (renaming) setRenaming(false)
  }, [chatId])

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

  const handleDeleteChat = async () => {
    if (!chatId) return
    try {
      const data = await deleteChat(chatId)
      if (data.success) navigate('/chats/')
    } catch {
      setError('Failed to delete chat.')
    }
  }

  const handleAddMember = async (userId: string) => {
    if (!chatId) return
    try {
      const data = await addMember(chatId, userId)
      if (data.success) {
        const added = allUsers.find(u => u.id === userId)
        if (added) {
          setMembers(prev => [...prev, { id: added.id, username: added.username, role: 'MEMBER' }])
        }
      }
    } catch {
      setError('Failed to add member.')
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!chatId) return
    try {
      const data = await removeMember(chatId, userId)
      if (data.success) setMembers(prev => prev.filter(m => m.id !== userId))
    } catch {
      setError('Failed to remove member.')
    }
  }
  
  const handleDeleteMessage = async (messageId: string) => {
    if(!chatId) return
    try {
      const data = await deleteMessage(chatId, messageId)
      if (data.success) setMessages(prev => prev.filter(m => m.id !== messageId))
    } catch {
      setError('Failed to delete message.')
    }
  }

  if (chatLoading) return <p>Loading chat...</p>
  if (error && messages.length === 0) return <p>{error}</p>

  const nonMembers = allUsers.filter(u => !members.find(m => m.id === u.id))

  return (
    <div className={styles.wrapper}>
      <ChatHeader
        chatName={chatName}
        isGroup={isGroup}
        isAdmin={isAdmin}
        renaming={renaming}
        newName={newName}
        members={members}
        nonMembers={nonMembers}
        currentUserId={user?.id ?? ''}
        onNewNameChange={setNewName}
        onRenameSubmit={handleRename}
        onRenameStart={() => setRenaming(true)}
        onRenameCancel={() => setRenaming(false)}
        onDeleteChat={handleDeleteChat}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
      />
      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <button
            className={styles.iconButton}
            onClick={() => setError(null)}
            aria-label='Close'
          >
            <X size={16} />
          </button>
        </div>
      )}
      <MessageList
        messages={messages}
        currentUserId={user?.id ?? ''}
        editingMessageId={editingMessageId}
        editingText={editingText}
        onEditingTextChange={setEditingText}
        onEditStart={startEditing}
        onEditSubmit={handleEditMessage}
        onEditCancel={cancelEditing}
        onDelete={handleDeleteMessage}
      />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSend}
      />
    </div>
  )
}

export default Chat
