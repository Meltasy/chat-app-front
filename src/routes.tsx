import type { RouteObject } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import Profile from './pages/Profile.tsx'
import AllChats from './pages/AllChats.tsx'
import Chat from './pages/Chat.tsx'
import NewChat from './pages/NewChat.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import ErrorPage from './pages/ErrorPage.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

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
        element: <ProtectedRoute><AllChats /></ProtectedRoute>,
        children: [
          {
            index: true,
            element: <div><h4>Select a chat or create a new one.</h4></div>
          },
          {
            path: 'new',
            element: (
              <ErrorBoundary fallback={<p>New chat failed to load. Please try again.</p>}>
                <NewChat />
              </ErrorBoundary>
            )
          },
          {
            path: ':chatId',
            element: (
              <ErrorBoundary fallback={<p>This chat failed to load. Please try again.</p>}>
                <Chat />
              </ErrorBoundary>
            )
          }
        ]
      },
    ]
  },
]

export default routes
