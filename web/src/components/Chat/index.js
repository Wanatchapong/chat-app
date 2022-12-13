import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../../context/socket'

import VideoPlayer from '../VideoPlayer'

const videoJsOptions = {
  autoplay: true,
  controls: true,
  responsive: true,
  fluid: true,
  sources: [
    // {
    //   src: '/movie.mp4',
    //   type: 'video/mp4',
    // },
    {
      src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
      type: 'application/x-mpegurl',
    },
  ],
}

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
  const playerRef = useRef()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handlePlayerReady = (player) => {
    playerRef.current = player

    player.on('waiting', () => {
      console.log('player is waiting')
    })

    player.on('dispose', () => {
      console.log('player will dispose')
    })
  }

  return (
    <div className="chat-container">
      <div className="left">
        <VideoPlayer options={videoJsOptions} onReady={handlePlayerReady} />
      </div>

      <div className="right">
        <div style={{ marginTop: '10px' }}>
          Room: {room}, Total users: {totalUsers}
        </div>

        <br />

        <ul ref={msgBoxRef} className="message-list">
          {messages.map((msg, index) => (
            <li key={`msg-${index}`}>{msg}</li>
          ))}
        </ul>

        <br />

        <form onSubmit={handleMessage}>
          <span>{username} : </span>
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
    </div>
  )
}
