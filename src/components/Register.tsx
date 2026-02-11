import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { register } from '../api.ts'
import { getCurrentUser, type User } from '../utils/authenticate.ts'

interface OutletContext {
  onUserUpdate: (user: User | null) => void
}

interface FormErrors {
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
  general?: string
}

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { onUserUpdate } = useOutletContext<OutletContext>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!form.username.trim()) {
      newErrors.username = 'Username is required.'
    } else if (form.username.length < 6 || form.username.length > 100) {
      newErrors.username = 'Username must be between 6 and 100 characters.'
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.'
    } else if (form.email.length > 100) {
      newErrors.email = 'Email must not exceed 100 characters.'
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address.'
    }
    if (!form.password) {
      newErrors.password = 'Password is required.'
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,24}$/.test(form.password)) {
      newErrors.password = 'Password must contain one number, one lowercase letter, one uppercase letter, one special character, no spaces, and be between 8 and 24 characters.'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) {
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
      <header>
        <h1>Register</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className = 'errorBox'>
            {errors.general && <div className='errors'>{errors.general}</div>}
          </div>
          <div>
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
            <div className = 'errorBox'>
              {errors.username && <div className='errors'>{errors.username}</div>}
            </div>
          </div>
          <div>
            <label htmlFor='email'>Email *</label>
            <input
              id='email'
              name='email'
              placeholder='donald.duck@example.com'
              type='email'
              autoComplete='email'
              title='Please enter a valid email address, no longer than 100 characters.'
              value={form.email}
              onChange={handleChange}
              required
            />
            <div className = 'errorBox'>
              {errors.email && <div className='errors'>{errors.email}</div>}
            </div>
          </div>
          <div>
            <label htmlFor='password'>Password *</label>
            <input
              id='password'
              name='password'
              type='password'
              autoComplete='new-password'
              title='Password must contain one number, one lowercase letter, one uppercase letter, one special character, no spaces, and be between 8 and 24 characters.'
              value={form.password}
              onChange={handleChange}
              required
            />
            <div className = 'errorBox'>
              {errors.password && <div className='errors'>{errors.password}</div>}
            </div>
          </div>
          <div>
            <label htmlFor='confirmPassword'>Confirm password *</label>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              autoComplete='new-password'
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className = 'errorBox'>
              {errors.confirmPassword && <div className='errors'>{errors.confirmPassword}</div>}
            </div>
          </div>
          <div className='buttonBox'>
            <button className='button' type='submit' disabled={loading}>
              {loading ? 'Signing up ...' : 'Sign up'}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default Register
