import type { RouteObject } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Profile from './pages/Profile.tsx'
import Chats from './pages/Chats.tsx'
import NewChat from './components/NewChat.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
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
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: 'chats',
        element: <ProtectedRoute><Chats /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <div><h4>Select a chat or create a new one.</h4></div>
          },
          {
            path: 'new',
            element: <NewChat />
          },
          // {
          //   path: ':chatId',
          //   element: <Chat />
          // }
        ]
      },
    ]
  },
]

export default routes
