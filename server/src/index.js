const path = require('path')

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') })

const { env, port } = require('./config')
console.log('environment:', env)

const server = require('./server')

server.listen(port, () => {
  console.log(`server started on port: ${port}`)
})

server.on('error', (e) => {
  console.error('server error:', e)
})
