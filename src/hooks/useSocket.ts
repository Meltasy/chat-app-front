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
    socket.on('new_message', (message: Message) => {
      if (message.sender.id === currentUserId) return
      setMessages(prev => [...prev, message])
    })
    socket.on('message_edited', ({ id, text }: { id: string, text: string }) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text } : m))
    })
    socket.on('message_deleted', ({ id }: { id: string }) => {
      setMessages(prev => prev.filter(m => m.id !== id))
    })
    return () => {
      socket.emit('leave_chat', chatId)
      socket.off('new_message')
      socket.off('message_edited')
      socket.off('message_deleted')
    }
  }, [chatId])
}
