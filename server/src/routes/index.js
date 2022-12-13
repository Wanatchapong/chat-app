const pkgJson = require('../../package.json')
const asyncHandler = require('../middlewares/async-handler.middleware')
const { apiBaseURL } = require('../config')
const jwt = require('../utils/jwt')
const chatStore = require('../utils/chat-store')
const { toUserResponse } = require('../utils/common')

const initRoutes = (app, io) => {
  app.get('/version', (req, res, next) => {
    res.json({
      name: pkgJson.name,
      version: pkgJson.version,
    })
  })

  app.post(`${apiBaseURL}/send-message`, (req, res, next) => {
    io.emit('message', req.body.message)

    res.json({
      data: 'success',
    })
  })

  /*
  {
    "roomId": "R001",
    "userId": "U001",
    "username": "JD",
    "fullName": "John Doe",
    "color": "#FFBF00",
    "capabilities": ["SEND_MESSAGE", "DELETE_MESSAGE", "DISCONNECT_USER"]
  }
  */
  app.post(
    `${apiBaseURL}/chat/auth`,
    asyncHandler(async (req, res, next) => {
      console.log('chat auth ->', req.body)
      const { body } = req
      const { roomId, userId } = body || {}

      const session = await chatStore.findSession(roomId, userId)
      let user = await chatStore.findUser(roomId, userId)
      // 1. session and user already exists
      if (session.token && user) {
        return res.json({
          token: session.token,
          user: toUserResponse(user),
        })
      }
      // 2. session not exists or expired then generate token and store into memory storage
      const token = jwt.generateToken(
        {
          roomId,
          userId,
        },
        '12h',
      )
      await chatStore.saveSession({ roomId, userId, token })
      // 3. make sure user should exists in memory storage for repeat auth with same data
      user = await chatStore.findUser(roomId, userId)
      if (!user) {
        await chatStore.saveUser(body)
        user = { ...body }
      }

      return res.json({
        token,
        user: toUserResponse(user),
      })
    }),
  )

  app.post(
    `${apiBaseURL}/chat/delete`,
    asyncHandler(async (req, res, next) => {
      // request: roomId
      // 1. delete all sessions and all users from redis
      // 2. make all sockets of "/chat" namespace leave the roomId
      return res.json({
        message: 'success',
      })
    }),
  )
}

module.exports = initRoutes
