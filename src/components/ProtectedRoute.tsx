import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../utils/authenticate.ts'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = getCurrentUser()
  if (!user) {
    return <Navigate to='/' replace />
  }
  return <>{children}</>
}

export default ProtectedRoute
