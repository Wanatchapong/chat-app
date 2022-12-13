import { useSocket } from '../../context/socket'

export default function ChatLogin({
  room,
  username,
  onInfoChange,
  onJoined,
  onInitialTotalUsers,
}) {
  const socket = useSocket()

  const handleSubmit = (e) => {
    e.preventDefault()

    socket.emit('room_join', { room, username }, (result) => {
      console.log('callback result:', result)
      onInitialTotalUsers(result.totalUsers)
    })

    onJoined(true)
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <div className="login-form">
          <label htmlFor="room">Room: </label>
          <input
            id="room"
            autoComplete="off"
            value={room}
            onChange={({ target }) => {
              onInfoChange('room', target.value)
            }}
          />

          <label htmlFor="username">Username: </label>
          <input
            id="username"
            autoComplete="off"
            value={username}
            onChange={({ target }) => {
              onInfoChange('username', target.value)
            }}
          />
        </div>

        <br />

        <button onClick={handleSubmit}>Join</button>
      </form>
    </div>
  )
}
