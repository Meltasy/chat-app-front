import { SendHorizontal } from 'lucide-react'
import styles from '../assets/components/Chat.module.css'

interface Props {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

function MessageInput({ value, onChange, onSend }: Props) {
  return (
    <div className={`${styles.wrapperDiv} ${styles.buttonDiv} ${styles.messageInput}`}>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSend()}
        placeholder='Type a message...'
        className={styles.inputChat}
      />
      <button
        onClick={onSend}
        disabled={!value.trim()}
        className={styles.iconButton}
        aria-label='Send message'
      >
        <SendHorizontal />
      </button>
    </div>
  )
}

export default MessageInput
