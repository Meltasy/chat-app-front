import { useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Register from '../components/Register.tsx'
import LogIn from '../components/LogIn.tsx'
import type { User } from '../utils/authenticate.ts'
import styles from '../assets/pages/Home.module.css'

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
        {user ? (
          <h1>Welcome, {user.username}!</h1>
        ) : (
          <h1>Please register or log in.</h1>
        )}
      </header>
      <main className={styles.wrapper}>
        <LogIn />
        <Register />
      </main>
    </div>
  )
}

export default Home
