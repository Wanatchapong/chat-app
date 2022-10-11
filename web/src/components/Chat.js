import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../context/socket'

function Chat() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const socket = useSocket()

  const handleMessageFromServer = useCallback((msg) => {
    console.log('on message:', msg)
    setMessages((prev) => {
      return prev.concat(msg)
    })
    window.scrollTo(0, document.body.scrollHeight)
  }, [])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket:', socket.id, 'has connected')
    })

    socket.on('disconnect', (reason) => {
      console.log('socket:', socket.id, 'disconnected reason:', reason)
    })

    socket.on('message', handleMessageFromServer)

    socket.on('web-update', (data) => {
      console.log('socket:', socket.id, ', web-update:', data)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('message')
    }
  }, [socket, handleMessageFromServer])

  const handleMessageEnter = (e) => {
    e.preventDefault()
    socket.emit('message', inputMessage)
    setInputMessage('')
  }

  return (
    <div className="App">
      <ul
        style={{
          listStyleType: 'none',
        }}
      >
        {messages.map((msg, index) => (
          <li key={`msg-${index}`}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={handleMessageEnter}>
        <input
          id="input"
          autoComplete="off"
          value={inputMessage}
          onChange={({ target }) => {
            setInputMessage(target.value)
          }}
        />
        <button onClick={handleMessageEnter}>Send</button>
      </form>
    </div>
  )
}

export default Chat
