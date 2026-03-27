import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { createChat } from '../api.ts'
import type { User } from '../utils/authenticate.ts'
import { useAllUsers } from '../hooks/useAllUsers.ts'
import styles from '../assets/components/NewChat.module.css'

function NewChat() {
  const { user } = useOutletContext<{ user: User | null }>()
  const { allUsers, usersLoading, usersError } = useAllUsers()
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [groupName, setGroupName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  const toggleUser = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    )
  }

  const handleCreate = async () => {
    if (selectedUsers.length === 0) return
    setCreating(true)
    setError(null)
    try {
      const result = await createChat(selectedUsers, selectedUsers.length > 1 ? groupName : undefined)
      if (result.success && result.chat) {
        navigate(`/chats/${result.chat.id}`)
      } else {
        setError(result.message || 'Failed to create chat.')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to create chat.')
      }
    } finally {
      setCreating(false)
    }
  }

  if (!user) return <p>Loading user...</p>

  return(
    <div className={styles.wrapper}>
      <div className={styles.wrapperDiv}>
        <h4>Choose friends:</h4>
        {allUsers.map(u => (
          <div
            key={u.id}
            onClick={() => toggleUser(u.id)}
            className={`${styles.userItem} ${selectedUsers.includes(u.id) ? styles.selected : ''}`}
          >
            {u.username}
          </div>
        ))}
      </div>
      <div className={styles.wrapperDiv}>
        <h4>Group name (optional):</h4>
          <input
            type='text'
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder='New Group'
            minLength={5}
            maxLength={100}
            className={styles.inputName}
          />
      </div>
      <button
        disabled={selectedUsers.length === 0}
        onClick={handleCreate}
        className={styles.button}
      >
        Create Chat
      </button>
      {usersLoading && <p>Loading users...</p>}
      {creating && <p>Creating chat...</p>}
      {(error || usersError) && <p>{error || usersError}</p>}
    </div>
  )
}

export default NewChat
