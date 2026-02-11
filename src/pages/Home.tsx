import { useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Register from '../components/Register.tsx'
import LogIn from '../components/LogIn.tsx'
import type { User } from '../utils/authenticate.ts'

interface OutletContext {
  user: User | null
  onUserUpdate: (user: User | null) => void
}

function Home() {
  const { user } = useOutletContext<OutletContext>()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/profile')
    }
  }, [user, navigate])

  return(
    <div>
      <header>
        <h1>Welcome to Chat App</h1>
      </header>
      <main>
        <LogIn />
        <Register />
      </main>
    </div>
  )
}

export default Home
