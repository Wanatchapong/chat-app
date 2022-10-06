const socketConnectionHandler = (socket, io) => {
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

module.exports = socketConnectionHandler
