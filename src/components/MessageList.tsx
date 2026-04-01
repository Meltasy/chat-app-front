import { Check, X, PencilLine, Trash2 } from 'lucide-react'
import styles from '../assets/components/Chat.module.css'

interface Message {
  id: string
  text: string
  sentAt: string
  sender: { id: string, username: string }
}

interface Props {
  messages: Message[]
  currentUserId: string
  editingMessageId: string | null
  editingText: string
  onEditingTextChange: (value: string) => void
  onEditStart: (messageId: string, currentText: string) => void
  onEditSubmit: (messageId: string) => void
  onEditCancel: () => void
  onDelete: (messageId: string) => void
}

function MessageList({
  messages,
  currentUserId,
  editingMessageId,
  editingText,
  onEditingTextChange,
  onEditStart,
  onEditSubmit,
  onEditCancel,
  onDelete
}: Props) {
  return (
    <ul className={`${styles.wrapperDiv} ${styles.messageList}`}>
      {messages.map((msg) => {
        const isOwn = msg.sender.id === currentUserId
        const isEditing = editingMessageId === msg.id
        return (
          <li key={msg.id} className={styles.messageItem}>
            {isEditing ? (
              <div className={styles.editForm}>
                <input
                  value={editingText}
                  onChange={e => onEditingTextChange(e.target.value)}
                  className={styles.inputChat}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') onEditSubmit(msg.id)
                    if (e.key === 'Escape') onEditCancel()
                  }}
                />
                <div className={styles.buttonBox}>
                  <button
                    onClick={() => onEditSubmit(msg.id)}
                    disabled={!editingText.trim()}
                    className={styles.iconButton}
                    aria-label='Save message'
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={onEditCancel}
                    className={styles.iconButton}
                    aria-label='Cancel edit message'
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.messageRow}>
                <span>
                  <strong>{msg.sender.username}</strong>: {msg.text}
                </span>
                {isOwn && (
                  <div className={styles.messageActions}>
                    <button
                      onClick={() => onEditStart(msg.id, msg.text)}
                      className={styles.iconButton}
                      aria-label='Edit message'
                    >
                      <PencilLine size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(msg.id)}
                      className={styles.iconButton}
                      aria-label='Delete Message'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default MessageList
