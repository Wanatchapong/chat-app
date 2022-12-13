const { createClient } = require('redis')

const client = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  },
  password: 'password',
})

client.on('error', (err) => {
  console.log('redis error:', err)
})

client.on('ready', () => {
  if (client.ping()) {
    console.log('redis connected')
  }
})

client.on('end', () => {
  console.log('redis disconnected')
})

module.exports = client
