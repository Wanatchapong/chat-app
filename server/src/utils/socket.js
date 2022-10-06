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

const onConnectionHandler = (io, socket) => {
  // console.log(`socket handshake:`, socket.handshake)
  console.log(`socket: ${socket.id} has connected`)

  socket.on('disconnect', () => {
    console.log(`socket: ${socket.id} disconnected`)
  })

  socket.on('message', (msg) => {
    console.log('event message:', msg)
    io.emit('message', msg)
  })
}

module.exports = {
  authHandler,
  onConnectionHandler,
}
