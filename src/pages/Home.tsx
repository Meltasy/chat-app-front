import { useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import Register from '../components/Register.tsx'
import LogIn from '../components/LogIn.tsx'
import type { User } from '../utils/authenticate.ts'
import styles from '../assets/pages/Home.module.css'

function Home() {
  const { user } = useOutletContext<{ user: User | null }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/profile')
    }
  }, [user, navigate])

  return(
    <div>
      <header>
        <h1>Please register or log in.</h1>
      </header>
      <main className={styles.wrapper}>
        <LogIn />
        <Register />
      </main>
    </div>
  )
}

export default Home
