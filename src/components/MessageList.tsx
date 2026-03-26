import styles from '../assets/components/Chat.module.css'

interface Message {
  id: string
  text: string
  sentAt: string
  sender: { username: string }
}

interface Props {
  messages: Message[]
}

function MessageList({ messages }: Props) {
  return (
    <ul className={`${styles.wrapperDiv} ${styles.messageList}`}>
      {messages.map((msg) => (
        <li key={msg.id} className={styles.messageItem}>
          <strong>{msg.sender.username}</strong>: {msg.text}
        </li>
      ))}
    </ul>
  )
}


export default MessageList
