import { NavLink } from 'react-router-dom'
import type { User } from '../utils/authenticate.ts'
import NavbarAnimation from './NavbarAnimation.tsx'
import RabbitIcon from './RabbitIcon.tsx'
import styles from '../assets/components/Navbar.module.css'

interface NavbarProps {
  user: User | null
  onLogout: () => void
}

function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className={styles.wrapper}>
      {!user && <NavbarAnimation />}
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
          <RabbitIcon size={40} />
        </>
      )}
    </nav>
  )
}

export default Navbar
