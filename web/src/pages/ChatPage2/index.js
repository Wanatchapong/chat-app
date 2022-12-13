import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

import config from '../../config'
// import { uuidv4 } from './utils'

const DEFAULT_ROOM_ID = 'R01'
const DEFAULT_COLOR = '#FFBF00'

export default function ChatPage2() {
  const [showSignIn, setShowSignIn] = useState(true)
  const [roomId, setRoomId] = useState(DEFAULT_ROOM_ID)
  const [username, setUsername] = useState('')
  const [moderator, setModerator] = useState(false)
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [chatToken, setChatToken] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)
  const [disconnected, setDisconnected] = useState(false)
  const navigate = useNavigate()

  const initSocketConnection = async (token) => {
    const socketInstance = io(`${config.socketServer}/chat`, {
      transports: ['websocket'],
      auth: {
        token,
      },
    })

    setSocket(socketInstance)
    setDisconnected(false)

    socketInstance.on('connect', () => {
      console.log(socketInstance.id, ' has connected')
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('disconnect reason:', reason)
      setDisconnected(true)
      alert('You has disconnected from chat')
    })

    socketInstance.on('connect_error', (error) => {
      console.log('connect error:', error)
    })

    socketInstance.on('message', (response) => {
      console.log('message:', response)
      const { data } = response || {}
      if (data) {
        setMessages((prevState) => {
          return [...prevState, data]
        })
      }
    })

    socketInstance.on('message:delete', (response) => {
      console.log('message:delete', response)
      const { data } = response || {}
      setMessages((prevState) => {
        const newState = prevState.filter(
          (item) => item.messageId !== data.messageId,
        )
        return newState
      })
    })

    socketInstance.on('user:disconnect', (response) => {
      console.log('user:disconnect', response)
      const { data } = response || {}
      setMessages((prevState) => {
        const newState = prevState.filter(
          (item) => item.sender.userId !== data.kickedUserId,
        )
        return newState
      })
    })

    // socketInstance.onAny((event, ...args) => {
    //   console.log(`incoming event: ${event}, args:`, args)
    // })

    // socketInstance.onAnyOutgoing((event, ...args) => {
    //   console.log(`outgoing event: ${event}, args:`, args)
    // })
  }

  useEffect(() => {
    return () => {
      if (socket) {
        socket.off('message')
        socket.off('connect_error')
        socket.off('disconnect')
        socket.off('connect')
      }
    }
  }, [socket])

  const requestToken = () => {
    // initSocketConnection(chatToken)

    // const uuid = uuidv4()

    const capabilities = moderator
      ? ['SEND_MESSAGE', 'DELETE_MESSAGE', 'DISCONNECT_USER']
      : ['SEND_MESSAGE']

    const data = {
      roomId: roomId,
      userId: username,
      username: username,
      fullName: `${username} (${new Date().getTime()})`,
      color: color,
      capabilities,
      // durationInMinutes: config.TOKEN_EXPIRATION_IN_MINUTES,
    }

    axios
      .post(`${config.apiBaseUrl}/chat/auth`, data)
      .then((res) => {
        console.log('auth response:', res.data)
        const { token } = res.data || {}
        setChatToken(token)
        initSocketConnection(token)
      })
      .catch((err) => {
        setChatToken(null)
        console.error('auth error:', err)
      })

    setShowSignIn(false)
  }

  const sendMessage = (message) => {
    const data = {
      type: 'text',
      text: message,
    }
    socket.emit('message', data)
  }

  const handleMessageChange = ({ target }) => {
    setMessage(target.value)
  }

  const handleMessageKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (message) {
        sendMessage(message)
        setMessage('')
      }
    }
  }

  const handleMessageDelete = (messageId) => {
    socket.emit('message:delete', {
      messageId,
      reason: 'Deleted by moderator',
    })
  }

  const handleUserKick = ({ socketId, sender }) => {
    socket.emit('user:disconnect', {
      socketId,
      userId: sender.userId,
      reason: 'Kicked by moderator',
    })
  }

  const renderSignIn = () => (
    <div className="sign-in">
      <h1>Join the chat room</h1>
      <form>
        <fieldset>
          <div>
            <label htmlFor="roomId" className="mg-b-05">
              Room ID
            </label>
            <input
              name="roomId"
              id="roomId"
              type="text"
              placeholder=""
              autoComplete="off"
              value={roomId}
              onChange={(e) => {
                e.preventDefault()
                setRoomId(e.target.value)
              }}
            />
          </div>
          <div>
            <label htmlFor="name" className="mg-b-05">
              Username
            </label>
            <input
              name="name"
              id="name"
              type="text"
              placeholder=""
              autoComplete="off"
              value={username}
              onChange={(e) => {
                e.preventDefault()
                setUsername(e.target.value)
              }}
            />
          </div>
          {/* <div>
            <label htmlFor="name" className="mg-b-05">
              Token
            </label>
            <input
              name="token"
              id="token"
              type="text"
              placeholder=""
              autoComplete="off"
              value={chatToken}
              onChange={(e) => {
                e.preventDefault()
                setChatToken(e.target.value)
              }}
            />
          </div> */}
          <hr />
          <div className="fl fl-a-center fl-j-start full-width">
            <input
              type="checkbox"
              id="moderator"
              name="moderator"
              checked={moderator}
              onChange={(e) => {
                setModerator(e.target.checked)
              }}
            />
            <label htmlFor="moderator">As moderator</label>
          </div>
          <hr />
          <button
            type="button"
            onClick={(e) => {
              requestToken()
            }}
            className="btn btn--primary rounded mg-t-1"
            disabled={!roomId || !username}
          >
            Start Chat
          </button>
        </fieldset>
      </form>
    </div>
  )

  const renderChatLineActions = (message) => {
    return (
      <>
        <button
          className="chat-line-btn"
          onClick={(e) => {
            e.preventDefault()
            handleMessageDelete(message.messageId)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
        <button
          className="chat-line-btn"
          onClick={(e) => {
            e.preventDefault()
            handleUserKick(message)
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            enableBackground="new 0 0 24 24"
            height="24px"
            viewBox="0 0 24 24"
            width="24px"
          >
            <rect fill="none" height="24" width="24" />
            <g>
              <path d="M8.65,5.82C9.36,4.72,10.6,4,12,4c2.21,0,4,1.79,4,4c0,1.4-0.72,2.64-1.82,3.35L8.65,5.82z M20,17.17 c-0.02-1.1-0.63-2.11-1.61-2.62c-0.54-0.28-1.13-0.54-1.77-0.76L20,17.17z M21.19,21.19L2.81,2.81L1.39,4.22l8.89,8.89 c-1.81,0.23-3.39,0.79-4.67,1.45C4.61,15.07,4,16.1,4,17.22V20h13.17l2.61,2.61L21.19,21.19z" />
            </g>
          </svg>
        </button>
      </>
    )
  }

  const renderChat = () => (
    <div className="chat-wrapper">
      <div className="messages">
        {messages.map((message) => (
          <div className="chat-line-wrapper" key={message.messageId}>
            <div className="chat-line" key={message.messageId}>
              <p>
                <span className="username">{message.sender.username}</span>
                <span dangerouslySetInnerHTML={{ __html: message.text }} />
              </p>
            </div>
            {moderator ? renderChatLineActions(message) : ''}
          </div>
        ))}
      </div>
      <div className="chat-input">
        {disconnected ? (
          <button
            type="button"
            onClick={() => {
              navigate(0)
            }}
          >
            Back to Login
          </button>
        ) : (
          <>
            <span>{username} :</span>
            <input
              type="text"
              value={message}
              maxLength={500}
              onChange={handleMessageChange}
              onKeyDown={handleMessageKeyDown}
            />
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="chat2-container">
      {showSignIn ? renderSignIn() : renderChat()}
    </div>
  )
}
