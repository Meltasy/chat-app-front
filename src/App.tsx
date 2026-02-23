import { Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/navbar.tsx'
import Footer from './components/footer.tsx'
import { getCurrentUser, type User } from './utils/authenticate.ts'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleUserUpdate = (updatedUser: User | null) => {
    setUser(updatedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  return (
    <div className='wrapperApp'>
      <Navbar user={user} onLogout={handleLogout} />
      <main className='mainApp'>
        <Outlet context={{ user, onUserUpdate: handleUserUpdate }}/>
      </main>
      <Footer />
    </div>
  )
}

export default App
