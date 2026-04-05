import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import socket from '../utils/socket.ts'
import { login } from '../api.ts'
import { getCurrentUser, type User } from '../utils/authenticate.ts'
import { validateLoginForm, type LoginErrors } from '../utils/formValidation.ts'
import styles from '../assets/pages/Home.module.css'

interface OutletContext {
  onUserUpdate: (user: User | null) => void
}

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { onUserUpdate } = useOutletContext<OutletContext>()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validateLoginForm(email, password)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setErrors({})
    try {
      const response = await login(email, password)
      if (response.success && response.token) {
        localStorage.setItem('token', response.token)
        const user = getCurrentUser()
        onUserUpdate(user)
        socket.connect()
        socket.on('connect', () => {
          socket.emit('join_user_room', user!.id)
        })
        navigate('/profile')
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Invalid email or password.')) {
          setErrors({ general: 'Invalid email or password.' })
        } else {
          setErrors({ general: error.message })
        }
      } else {
        setErrors({ general: 'An unexpected error occurred.' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (errors.email || errors.general) {
      const newErrors = { ...errors }
      delete newErrors.email
      delete newErrors.general
      setErrors(newErrors)
    }
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password || errors.general) {
      const newErrors = { ...errors }
      delete newErrors.password
      delete newErrors.general
      setErrors(newErrors)
    }
  }

  return (
    <>
      <main>
        <h2>Log in</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.errorBox}>
            {errors.general && <div className={styles.errors}>{errors.general}</div>}
          </div>
          <div className={styles.labelInputBox}>
            <label htmlFor='login-email'>Email *</label>
            <input
              id='login-email'
              name='email'
              placeholder='donald.duck@example.com'
              type='email'
              autoComplete='email'
              value={email}
              onChange={handleEmailChange}
              autoFocus
              required
            />
            <div className={styles.errorBox}>
              {errors.email && <div className={styles.errors}>{errors.email}</div>}
            </div>
          </div>
          <div className={styles.labelInputBox}>
            <label htmlFor='login-password'>Password *</label>
            <input
              id='login-password'
              name='password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <div className={styles.errorBox}>
              {errors.password && <div className={styles.errors}>{errors.password}</div>}
            </div>
          </div>
          <div className={styles.buttonBox}>
            <button type='submit' disabled={loading}>
              {loading ? 'logging in ...' : 'Log in'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default LogIn
