import { useState } from 'react'
import { SocketProvider } from './context/socket'
import Chat from './components/Chat'
import Login from './components/Login'

import './App.css'

function App() {
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
      <div className="App">
        {joined ? (
          <Chat
            {...info}
            initialTotalUsers={initialTotalUsers}
            onExitChat={handleExitChat}
          />
        ) : (
          <Login
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

export default App
