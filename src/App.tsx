import { Outlet, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import socket from './utils/socket.ts'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import { getCurrentUser, type User } from './utils/authenticate.ts'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    if (currentUser) {
      socket.connect()
      socket.on('connect', () => {
        socket.emit('join_user_room', currentUser.id)
      })
    }
  }, [])

  const handleUserUpdate = (updatedUser: User | null) => {
    setUser(updatedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    socket.disconnect()
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
