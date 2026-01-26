import type { RouteObject } from 'react-router-dom'
import App from './App'
import ErrorPage from './pages/ErrorPage.tsx'

const routes: RouteObject[] = [
  {
    path:'/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/user/:name',
    element: <App />,
    errorElement: <ErrorPage />,
  },
]

export default routes
