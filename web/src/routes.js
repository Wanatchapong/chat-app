import { Navigate } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import ChatPage2 from './pages/ChatPage2'
import NotFoundPage from './pages/NotFoundPage'

export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  CHAT: '/chat',
  CHAT2: '/chat2',
  ALL: '*',
}

export const routes = [
  {
    path: ROUTE_PATHS.ROOT,
    element: <Navigate to={{ pathname: ROUTE_PATHS.CHAT }} replace />,
  },
  {
    path: ROUTE_PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.CHAT,
    element: <ChatPage />,
  },
  {
    path: ROUTE_PATHS.CHAT2,
    element: <ChatPage2 />,
  },
  {
    path: ROUTE_PATHS.ALL,
    element: <NotFoundPage />,
  },
]
