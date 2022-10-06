import { createContext, useContext } from 'react'
import { io } from 'socket.io-client'
import config from '../config'

// ref: https://dev.to/bravemaster619/how-to-prevent-multiple-socket-connections-and-events-in-react-531d
const socket = io(config.socketServer, {
  transports: ['websocket'],
  auth: (cb) => {
    // cb({ token: localStorage.getItem('socket_token') })
    cb({ token: config.socketToken })
  },
})

const SocketContext = createContext(socket)

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  const ctx = useContext(SocketContext)
  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return ctx
}
