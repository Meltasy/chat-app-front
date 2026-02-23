import { useOutletContext } from 'react-router-dom'
import type { User } from '../utils/authenticate.ts'

function Profile() {
  const { user } = useOutletContext<{ user: User | null }>()

  if (!user) return null

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  )
}

export default Profile
