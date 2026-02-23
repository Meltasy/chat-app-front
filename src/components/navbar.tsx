import { NavLink } from 'react-router-dom'
import type { User } from '../utils/authenticate.ts'
import styles from '../assets/components/Navbar.module.css'

interface NavbarProps {
  user: User | null
  onLogout: () => void
}

function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className={styles.wrapper}>
      {!user && (
        <NavLink
          to='/'
          className={({ isActive }) =>
            isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
          }
        >
          Home
        </NavLink>
      )}
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
            to='/chats'
            className={({ isActive }) =>
              isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
            }
          >
            Chats
          </NavLink>
          <button
            onClick={onLogout}
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
