import { useState } from 'react'
import { updateMessage } from '../api.ts'

type Message = {
  id: string, text: string, sentAt: string, sender: { id: string, username: string }
}

export function useMessageEditing(
  chatId: string | undefined,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const startEditing = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId)
    setEditingText(currentText)
  }

  const cancelEditing = () => {
    setEditingMessageId(null)
    setEditingText('')
  }

  const handleEditMessage = async (messageId: string) => {
    const trimmedText = editingText.trim()
    if(!trimmedText || !chatId) return
    try {
      const data = await updateMessage(chatId, messageId, trimmedText)
      if (data.success && data.data) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, text: data.data!.text} : m))
        setEditingMessageId(null)
        setEditingText('')
      }
    } catch {
      setError('Failed to edit message.')
    }
  }

  return { editingMessageId, editingText, setEditingText, startEditing, cancelEditing, handleEditMessage }
}
