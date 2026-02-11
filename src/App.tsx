import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/navbar.tsx'
import Footer from './components/footer.tsx'
import { getCurrentUser, type User } from './utils/authenticate.ts'

function App() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }, [])

  const handleUserUpdate = (updatedUser: User | null) => {
    setUser(updatedUser)
  }

  return (
    <div className='wrapperApp'>
      <Navbar user={user} />
      <main className='mainApp'>
        <Outlet context={{ user, onUserUpdate: handleUserUpdate }}/>
      </main>
      <Footer />
    </div>
  )
}

export default App
