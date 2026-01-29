interface JWTPayload {
  id: string
  username: string
  email: string
  exp?: number
  iat?: number
}

interface User {
  id: string
  username: string
  email: string
}

const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid JWT format')
      return null
    }
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload) as JWTPayload
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return null
  }
}

const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token)
  if (!decoded || !decoded.exp) {
    return true
  }
  const currentTime = Date.now() / 1000
  return decoded.exp < currentTime
}

const getCurrentUser = (): User | null => {
  const token = localStorage.getItem('token')
  if (!token) {
    return null
  }
  if (isTokenExpired(token)) {
    localStorage.removeItem('token')
    return null
  }
  const decoded = decodeJWT(token)
  return decoded ? {
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
  } : null
}

const getUserHeader = (): { Authorization?: string } => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` }: {}
}

const logout = (): void => {
  localStorage.removeItem('token')
  window.location.href = '/'
}

export type { JWTPayload, User }

export {
  getCurrentUser,
  getUserHeader,
  logout
}
