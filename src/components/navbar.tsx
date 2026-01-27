import { NavLink } from 'react-router-dom'
import styles from '../assets/components/Navbar.module.css'

function Navbar() {
  return (
    <nav className={styles.wrapper}>
      <NavLink
        to='/'
        className={({ isActive }) =>
          isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
        }
      >
        Home
      </NavLink>
      <NavLink
        to='/index/register'
        className={({ isActive }) =>
          isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
        }
      >
        Register
      </NavLink>
      <NavLink
        to='/index/login'
        className={({ isActive }) =>
          isActive ? `${styles.linkTitle} ${styles.active}` : styles.linkTitle
        }
      >
        Login
      </NavLink>
    </nav>
  )
}

export default Navbar