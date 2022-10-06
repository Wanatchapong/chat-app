const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { createServer } = require('http')
const { Server } = require('socket.io')

const initRoutes = require('./routes')
const errorHandler = require('./middlewares/error.middleware')
const notFoundHandler = require('./middlewares/not-found.middleware')
const { socketAuthHandler } = require('./middlewares/auth.middleware')
const socketConnectionHandler = require('./utils/socket')

const app = express()
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    preflightContinue: true,
    optionsSuccessStatus: 200,
  }),
)
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
  /* options */
})

io.use(socketAuthHandler)

io.on('connection', (socket) => socketConnectionHandler(socket, io))

initRoutes(app, io)

app.use(errorHandler)
app.use(notFoundHandler)

module.exports = httpServer