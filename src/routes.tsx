import type { RouteObject } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import ErrorPage from './pages/ErrorPage.tsx'

const routes: RouteObject[] = [
  {
    path:'/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      // {
      //   path: 'chats',
      //   element: <ProtectedRoute><Chats /></ProtectedRoute>
      // },
    ]
  },
]

export default routes
