import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { login } from '../api.ts'
import { getCurrentUser, type User } from '../utils/authenticate.ts'

interface OutletContext {
  onUserUpdate: (user: User | null) => void
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { onUserUpdate } = useOutletContext<OutletContext>()

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.'
    }
    return newErrors
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validateForm()
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
          <div className='errorBox'>
            {errors.general && <div className='errors'>{errors.general}</div>}
          </div>
          <div>
            <label htmlFor='email'>Email *</label>
            <input
              id='email'
              name='email'
              placeholder='donald.duck@example.com'
              type='email'
              autoComplete='email'
              value={email}
              onChange={handleEmailChange}
              autoFocus
              required
            />
            <div className='errorBox'>
              {errors.email && <div className='errors'>{errors.email}</div>}
            </div>
          </div>
          <div>
            <label htmlFor='password'>Password *</label>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <div className='errorBox'>
              {errors.password && <div className='errors'>{errors.password}</div>}
            </div>
          </div>
          <div className='buttonBox'>
            <button className='button' type='submit' disabled={loading}>
              {loading ? 'logging in ...' : 'Log in'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default LogIn