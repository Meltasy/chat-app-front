import { NavLink } from 'react-router-dom'
import type { User } from '../utils/authenticate.ts'
import { logout } from '../utils/authenticate.ts'
import styles from '../assets/components/Navbar.module.css'

interface NavbarProps {
  user: User | null
}

function Navbar({ user }: NavbarProps) {
  const handleLogout = () => {
    logout()
  }

  return (
    <nav className={styles.wrapper}>
      {user ? (
        <span>Welcome, {user.username}!</span>
       ) : (
        <span>Please register or log in.</span>
      )}
      <NavLink
        to='/'
        className={({ isActive }) =>
          isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
        }
      >
        Home / Login / Register
      </NavLink>
      {user && (
        <>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
            }
          >
            Profile
          </NavLink>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
            }
          >
            Chats
          </NavLink>
          <button
            onClick={handleLogout}
            className={styles.linkTitle}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  )
}

export default Navbar
