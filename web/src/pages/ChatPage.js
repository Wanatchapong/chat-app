import { useState } from 'react'
import { SocketProvider } from '../context/socket'
import Chat from '../components/Chat'
import ChatLogin from '../components/ChatLogin'

export default function ChatPage() {
  const [joined, setJoined] = useState(false)
  const [info, setInfo] = useState({
    room: '',
    username: '',
  })
  const [initialTotalUsers, setInitialTotalUsers] = useState(0)

  const handleInfoChange = (key, value) => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      [key]: value,
    }))
  }

  const handleExitChat = () => {
    setInfo({
      room: '',
      username: '',
    })
    setJoined(false)
  }

  return (
    <SocketProvider>
      <div className="chat-page">
        {joined ? (
          <Chat
            {...info}
            initialTotalUsers={initialTotalUsers}
            onExitChat={handleExitChat}
          />
        ) : (
          <ChatLogin
            {...info}
            onInfoChange={handleInfoChange}
            onJoined={setJoined}
            onInitialTotalUsers={setInitialTotalUsers}
          />
        )}
      </div>
    </SocketProvider>
  )
}
