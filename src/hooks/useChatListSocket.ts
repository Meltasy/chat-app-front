import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../utils/socket.ts'
import type { ChatPreview } from '../api'

interface IncomingMessage {
  id: string
  chatId: string
  text: string
  sentAt: string
  sender: { username: string }
}

export function useChatListSocket(
  currentChatId: string | undefined,
  chats: ChatPreview[],
  setChats: React.Dispatch<React.SetStateAction<ChatPreview[]>>
) {
   const navigate = useNavigate()

   useEffect(() => {
    chats.forEach(chat => socket.emit('join_chat', chat.id))
   }, [chats.length])

   useEffect(() => {
    const handleChatCreated = (newChat: ChatPreview) => {
      socket.emit('join_chat', newChat.id)
      setChats(prev => {
        if (prev.some(c => c.id === newChat.id)) return prev
        return [newChat, ...prev]
      })
    }
    const handleChatRenamed = ({ chatId, name }: { chatId: string, name: string }) => {
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, name } : c))
    }
    const handleChatDeleted = ({ chatId }: { chatId: string }) => {
      setChats(prev => prev.filter(c => c.id !== chatId))
      if (currentChatId === chatId) navigate('/chats')
    }
    const handleNewMessage = (message: IncomingMessage) => {
      setChats(prev => prev.map(chat =>
        chat.id === message.chatId
          ? { ...chat, lastMessage: {
            id: message.id,
            text: message.text,
            sentAt: message.sentAt,
            sender: { username: message.sender.username }
          }}
          : chat
      ))
    }
    const handleMessageEdited = ({ id, text, chatId }: { id: string, text: string, chatId: string }) => {
      setChats(prev => prev.map(chat =>
        chat.id === chatId && chat.lastMessage?.id === id
        ? { ...chat, lastMessage: { ...chat.lastMessage, text } }
        : chat
      ))
    }

    socket.on('chat_created', handleChatCreated)
    socket.on('chat_renamed', handleChatRenamed)
    socket.on('chat_deleted', handleChatDeleted)
    socket.on('new_message', handleNewMessage)
    socket.on('message_edited', handleMessageEdited)

    return () => {
      socket.off('chat_created', handleChatCreated)
      socket.off('chat_renamed', handleChatRenamed)
      socket.off('chat_deleted', handleChatDeleted)
      socket.off('new_message', handleNewMessage)
      socket.off('message_edited', handleMessageEdited)
    }
  }, [currentChatId])
}
