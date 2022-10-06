const config = require('../config')

const socketAuthHandler = (socket, next) => {
  const token = socket.handshake.auth.token
  console.log('socket authenticate token:', token)
  if (token && token === config.socketToken) {
    next()
  } else {
    next(new Error('socket authentication failed'))
  }
}

module.exports = {
  socketAuthHandler,
}
