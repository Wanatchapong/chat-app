const config = require('../config')

const authHandler = (socket, next) => {
  const token = socket.handshake.auth.token
  console.log('socket authenticate token:', token)
  if (token && token === config.socketToken) {
    next()
  } else {
    next(new Error('socket authentication failed'))
  }
}

const users = []

const addUser = ({ id, room, username }) => {
  room = room.trim().toLowerCase()
  username = username.trim().toLowerCase()

  if (!username || !room) {
    throw new Error('Username and room are required')
  }

  const existingUser = users.find(
    (user) => user.room === room && user.name === username,
  )

  if (!existingUser) {
    const newUser = { id, username, room }
    users.push(newUser)
  }
}

const removeUser = (id) => {
  const index = users.findIndex((item) => item.id === id)

  if (index !== -1) {
    users.splice(index, 1)
  }
}

const countUserInTheRoom = (room) => {
  return users.reduce((sum, user) => {
    return user.room === room ? sum + 1 : sum
  }, 0)
}

const onConnectionHandler = (io, socket) => {
  // console.log(`socket handshake:`, socket.handshake)
  console.log(`socket: ${socket.id} has connected`)

  socket.on('disconnect', () => {
    console.log(`socket: ${socket.id} disconnected`)
  })

  socket.on('message', (data) => {
    console.log('on message:', data)
    io.emit('message', data)
  })

  socket.on('room_join', (data, callback) => {
    const { room, username } = data

    socket.join(room)
    console.log(`socket: ${socket.id}, ${username} join the room: ${room}`)

    addUser({
      id: socket.id,
      room,
      username,
    })

    const totalUsers = countUserInTheRoom(room)

    socket.broadcast.to(room).emit('room_message', {
      room,
      username,
      message: `${username} has joined to the room ${room}`,
      totalUsers: totalUsers,
    })

    if (typeof callback == 'function') {
      // send total users immedietly in callback
      callback({
        totalUsers: totalUsers,
      })
    }
  })

  socket.on('room_leave', (data) => {
    const { room, username } = data

    socket.leave(room)
    console.log(`socket: ${socket.id}, ${username} left the room: ${room}`)

    removeUser(socket.id)

    const totalUsers = countUserInTheRoom(room)

    socket.broadcast.to(room).emit('room_message', {
      room,
      username,
      message: `${username} left the room ${room}`,
      totalUsers: totalUsers,
    })
  })
}

module.exports = {
  authHandler,
  onConnectionHandler,
}
