import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../context/socket'

export default function Chat({
  room,
  username,
  initialTotalUsers,
  onExitChat,
}) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [totalUsers, setTotalUsers] = useState(initialTotalUsers)
  const msgBoxRef = useRef()
  const socket = useSocket()

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket:', socket.id, 'has connected')
    })

    socket.on('disconnect', (reason) => {
      console.log('socket disconnected reason:', reason)
    })

    socket.on('message', (data) => {
      console.log('message:', data)

      if (room === data.room) {
        setMessages((prev) => {
          return prev.concat(`${data.username} : ${data.message}`)
        })

        msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight
      }
    })

    socket.on('room_message', (data) => {
      console.log('room_message:', data)

      if (room === data.room) {
        setMessages((prev) => {
          return prev.concat(data.message)
        })

        msgBoxRef.current.scrollTop = msgBoxRef.current.scrollHeight

        setTotalUsers(data.totalUsers)
      }
    })

    return () => {
      socket.off('room_message')
      socket.off('message')
      socket.off('disconnect')
      socket.off('connect')
    }
  }, [])

  useEffect(() => {
    setTotalUsers(initialTotalUsers)
  }, [initialTotalUsers])

  const handleMessage = (e) => {
    e.preventDefault()
    socket.emit('message', {
      room,
      username,
      message: inputMessage,
    })
    setInputMessage('')
  }

  const handleExit = (e) => {
    e.preventDefault()
    socket.emit('room_leave', { room, username })
    onExitChat()
  }

  return (
    <div>
      <div style={{ marginTop: '10px' }}>
        Room: {room}, Total users: {totalUsers}
      </div>

      <br />

      <ul
        ref={msgBoxRef}
        style={{
          listStyleType: 'none',
          width: '200px',
          height: '100px',
          margin: '0 auto',
          padding: '5px',
          overflowY: 'scroll',
          border: 'solid 1px',
          textAlign: 'left',
        }}
      >
        {messages.map((msg, index) => (
          <li key={`msg-${index}`}>{msg}</li>
        ))}
      </ul>

      <br />

      <form onSubmit={handleMessage}>
        <input
          id="input"
          autoComplete="off"
          value={inputMessage}
          onChange={({ target }) => {
            setInputMessage(target.value)
          }}
        />
        <button onClick={handleMessage}>Send</button>
      </form>

      <br />

      <button onClick={handleExit}>Exit</button>
    </div>
  )
}
