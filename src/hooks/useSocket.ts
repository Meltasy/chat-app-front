import { useEffect } from 'react'
import socket from '../utils/socket.ts'

interface Message {
  id: string
  text: string
  sentAt: string
  sender: { id: string, username: string }
}

export function useSocket(
  chatId: string | undefined,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  currentUserId: string | undefined
) {
  useEffect(() => {
    if (!chatId) return
    socket.emit('join_chat', chatId)
    
    const handleNewMessage = (message: Message) => {
      if (message.sender.id === currentUserId) return
      setMessages(prev => [...prev, message])
    }
    const handleEdited = ({ id, text }: { id: string, text: string }) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text } : m))
    }
    const handleDeleted = ({ id }: { id: string }) => {
      setMessages(prev => prev.filter(m => m.id !== id))
    }
    
    socket.on('new_message', handleNewMessage)
    socket.on('message_edited', handleEdited)
    socket.on('message_deleted', handleDeleted)
    
    return () => {
      socket.emit('leave_chat', chatId)
      socket.off('new_message', handleNewMessage)
      socket.off('message_edited', handleEdited)
      socket.off('message_deleted', handleDeleted)
    }
  }, [chatId])
}
