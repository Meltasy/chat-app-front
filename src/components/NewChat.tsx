import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { getAllUsers, createChat } from '../api.ts'
import type { User } from '../utils/authenticate.ts'

function NewChat() {
  const { user } = useOutletContext<{ user: User | null }>()
  const [allUsers, setAllUsers] = useState<{ id: string, username: string }[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [groupName, setGroupName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [usersLoading, setUsersLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  // Should I move this to a Custom Hook?
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
    <div>
      <h1>New Chat</h1>
      <div>
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
      </div>
      <div>
        <label>
          Group name (optional):
          <input
            type='text'
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder='New Group'
            minLength={5}
            maxLength={100}
          />
        </label>
      </div>
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
