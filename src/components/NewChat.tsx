import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { getAllUsers, createChat } from '../api.ts'

function NewChat() {
  const { user } = useOutletContext<{ user: { id: string } | null }>()
  const [allUsers, setAllUsers] = useState<{ id: string, username: string }[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [usersLoading, setUsersLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    const userId = user.id
    async function fetchUsers() {
      try {
        const result = await getAllUsers()
        if(result.success && result.users) {
          setAllUsers(result.users.filter(u => u.id !== userId))
        }
      } catch {
        setError('Failed to load users.')
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [user])

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
      const result = await createChat(selectedUsers)
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
    <div>
      <h1>New Chat</h1>
      <p>Choose friends:</p>
      {allUsers.map(u => (
        <label key={u.id}>
          <input
            type='checkbox'
            checked={selectedUsers.includes(u.id)}
            onChange={() => toggleUser(u.id)}
          />
          {u.username}
        </label>
      ))}
      <button
        disabled={selectedUsers.length === 0}
        onClick={handleCreate}
      >
        Create Chat
      </button>
      {usersLoading && <p>Loading users...</p>}
      {creating && <p>Creating chat...</p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default NewChat
