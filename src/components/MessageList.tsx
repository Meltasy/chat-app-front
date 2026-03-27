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
                  className={styles.input}
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter') onEditSubmit(msg.id)
                    if (e.key === 'Escape') onEditCancel()
                  }}
                />
                <button
                  onClick={() => onEditSubmit(msg.id)}
                  disabled={!editingText.trim()}
                  className={styles.button}
                >
                  Save
                </button>
                <button onClick={onEditCancel} className={styles.button}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className={styles.messageRow}>
                <span>
                  <strong>{msg.sender.username}</strong>: {msg.text}
                </span>
                {isOwn && (
                  <div className={styles.messageActions}>
                    <button
                      className={styles.iconButton}
                      onClick={() => onEditStart(msg.id, msg.text)}
                      aria-label='Edit message'
                      title='Edit'
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => onDelete(msg.id)}
                      aria-label='Delete Message'
                      title='Delete'
                    >
                      🗑️
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
