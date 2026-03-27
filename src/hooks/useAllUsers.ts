import { useState, useEffect } from 'react'
import { getAllUsers } from '../api.ts'

export function useAllUsers(enabled: boolean = true) {
  const [allUsers, setAllUsers] = useState<{ id: string, username: string }[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setUsersLoading(false)
      return
    }
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers()
        if(data.success && data.users) setAllUsers(data.users)
      } catch {
        setUsersError('Failed to load users.')
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [enabled])
  
  return { allUsers, usersLoading, usersError }
}
