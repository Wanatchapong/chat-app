const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { createServer } = require('http')
const { Server } = require('socket.io')

const initRoutes = require('./routes')
const errorHandler = require('./middlewares/error.middleware')
const notFoundHandler = require('./middlewares/not-found.middleware')
const redisClient = require('./utils/redis')
const defaultHandler = require('./socket/default.handler')
const chatHandler = require('./socket/chat.handler')

const app = express()
app.use(cors())
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
  }),
)
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  }),
)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
  },
})

// Default namespace
io.use(defaultHandler.useAuth)
io.on('connection', (socket) => defaultHandler.handleConnection(io, socket))

// Chat namespace
const chatIo = io.of('/chat')
chatIo.use(chatHandler.useAuth)
chatIo.on('connection', (socket) =>
  chatHandler.handleConnection(socket, chatIo),
)

redisClient.connect()

initRoutes(app, io)

app.use(errorHandler)
app.use(notFoundHandler)

module.exports = httpServer
