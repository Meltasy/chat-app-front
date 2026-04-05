import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import socket from '../utils/socket.ts'
import { register } from '../api.ts'
import { getCurrentUser, type User } from '../utils/authenticate.ts'
import { validateRegisterForm, type RegisterErrors } from '../utils/formValidation.ts'
import styles from '../assets/pages/Home.module.css'

interface OutletContext {
  onUserUpdate: (user: User | null) => void
}

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { onUserUpdate } = useOutletContext<OutletContext>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    const newErrors = { ...errors }
    if (name === 'username' && newErrors.username) {
      delete newErrors.username
    }
    if (name === 'email' && newErrors.email) {
      delete newErrors.email
    }
    if (name === 'password' && (newErrors.password || newErrors.confirmPassword)) {
      delete newErrors.password
      delete newErrors.confirmPassword
    }
    if (name === 'confirmPassword' && newErrors.confirmPassword) {
      delete newErrors.confirmPassword
    }
    if (newErrors.general) {
      delete newErrors.general
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validateRegisterForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    setErrors({})
    try {
      const response = await register(form.username, form.email, form.password)
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
        if (error.message.includes('Username already exists.') || error.message.includes('Email already exists.')) {
          setErrors({ general: 'This username or email already exists. Please try different credentials or login.' })
        } else if (error.message.includes('409')) {
          setErrors({ general: 'Username or email already taken. Please try again.' })
        } else {
          setErrors({ general: 'An error occurred during registration. Please try again.' })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.errorBox}>
            {errors.general && <div className={styles.errors}>{errors.general}</div>}
          </div>
          <div className={styles.labelInputBox}>
            <label htmlFor='username'>Username *</label>
            <input
              id='username'
              name='username'
              placeholder='Donald Duck'
              type='text'
              autoComplete='username'
              title='Username must be between 6 and 100 characters.'
              value={form.username}
              onChange={handleChange}
              autoFocus
              required
            />
            <div className={styles.errorBox}>
              {errors.username && <div className={styles.errors}>{errors.username}</div>}
            </div>
          </div>
          <div className={styles.labelInputBox}>
            <label htmlFor='register-email'>Email *</label>
            <input
              id='register-email'
              name='email'
              placeholder='donald.duck@example.com'
              type='email'
              autoComplete='email'
              title='Please enter a valid email address, no longer than 100 characters.'
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className={styles.errorBox}>
              {errors.email && <div className={styles.errors}>{errors.email}</div>}
            </div>
          </div>
          <div className={styles.labelInputBox}>
            <label htmlFor='register-password'>Password *</label>
            <input
              id='register-password'
              name='password'
              type='password'
              autoComplete='new-password'
              title='Password must contain one number, one lowercase letter, one uppercase letter, one special character, no spaces, and be between 8 and 24 characters.'
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className={styles.errorBox}>
              {errors.password && <div className={styles.errors}>{errors.password}</div>}
            </div>
          </div>
          <div className={styles.labelInputBox}>
            <label htmlFor='register-confirmPassword'>Confirm password *</label>
            <input
              id='register-confirmPassword'
              name='confirmPassword'
              type='password'
              autoComplete='new-password'
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className={styles.errorBox}>
              {errors.confirmPassword && <div className={styles.errors}>{errors.confirmPassword}</div>}
            </div>
          </div>
          <div className={styles.buttonBox}>
            <button type='submit' disabled={loading}>
              {loading ? 'Signing up ...' : 'Sign up'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default Register
