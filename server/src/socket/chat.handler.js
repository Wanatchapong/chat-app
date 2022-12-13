const moment = require('moment')
const jwt = require('../utils/jwt')
const { uuidv4, hasUserCapability } = require('../utils/common')
const { ErrorCodes } = require('../constants')
const chatStore = require('../utils/chat-store')
const profanityFilter = require('../badwords/leo-profanity')

const buildError = (code = 'internal_error', message) => {
  const err = new Error(message)
  err.error = {
    code,
  }
  return err
}

const buildSuccessResponse = (socket, data) => {
  const { id, roomId, userId, user } = socket
  const { username, fullName, color } = user || {}

  return {
    data: {
      ...data,
      socketId: id,
      roomId: roomId,
      sendTime: moment().toISOString(),
      sender: {
        userId: userId,
        username,
        fullName,
        color,
      },
    },
  }
}

const useAuth = (socket, next) => {
  /*
    1. Verify JWT token
    2. Check token session in redis
    3. Find user in redis
    4. Pass user data to socket
  */
  const token = socket.handshake.auth.token
  if (!token) {
    return next(buildError(ErrorCodes.AuthenticationFailure, 'not authorized'))
  }

  let decoded
  try {
    decoded = jwt.verifyToken(token)
  } catch (err) {
    return next(buildError(ErrorCodes.AuthenticationFailure, err.message))
  }
  console.log('auth decoded ->', decoded)
  const { roomId, userId } = decoded || {}

  chatStore
    .findSession(roomId, userId)
    .then((session) => {
      if (!session) {
        return next(
          buildError(ErrorCodes.AuthenticationFailure, 'invalid session'),
        )
      }

      chatStore
        .findUser(roomId, userId)
        .then((user) => {
          if (!user) {
            return next(
              buildError(
                ErrorCodes.AuthenticationFailure,
                `no user ${userId} found in room ${roomId}`,
              ),
            )
          }

          socket.roomId = roomId
          socket.userId = userId
          socket.user = user
          return next()
        })
        .catch((err) => {
          return next(buildError(ErrorCodes.AuthenticationFailure, err.message))
        })
    })
    .catch((err) => {
      return next(buildError(ErrorCodes.AuthenticationFailure, err.message))
    })
}

const handleConnection = (socket, io) => {
  console.log('chat socket connection ->', socket.id)

  const hasRoom = socket.rooms.has(socket.roomId)
  if (!hasRoom) {
    socket.join(socket.roomId)
    console.log('socket:', socket.id, ' joined the room:', socket.roomId)
  }

  /*
    Event: Send Message
    Request:
    {
      type: 'text', // sticker,image,video
      text: 'Hello word'
    }

    Success Response:
    {
      data: {
        messageId: '111',
        type: 'text',
        text: 'Hello world',
        socketId: '123',
        roomId: 'R001',
        sendTime: '2022-12-02T08:25:51.999Z',
        sender: {
          userId: 'U001',
          username: 'JD',
          fullName: 'John Doe',
          color: '#FFBF00'
        },
      }
    }
  */
  socket.on('message', (data) => {
    console.log('message ->', data)
    const hasCapability = hasUserCapability(socket.user, 'SEND_MESSAGE')
    if (!hasCapability) {
      // TODO: make an error and emit to client
      return
    }

    const response = buildSuccessResponse(socket, {
      messageId: uuidv4(),
      type: data.type,
      text: profanityFilter.clean(data.text),
    })

    console.log('before send messasge to client:', response)

    // to all clients in room (includes the sender)
    io.to(socket.roomId).emit('message', response)
  })

  /*
    Event: Delete Message by ID
    Request data:
    {
      messageId: 'M2YcHkgffEvU',
      reason: 'Deleted by moderator',
    }

    Success Response:
    {
      data: {
        messageId: 'M2YcHkgffEvU',
        reason: 'Deleted by moderator',
        socketId: '123',
        roomId: 'R001',
        sendTime: '2022-12-02T08:25:51.999Z',
        sender: {
          userId: 'U001',
          username: 'JD',
          fullName: 'John Doe',
          color: '#FFBF00'
        },
      }
    }
  */
  socket.on('message:delete', (data) => {
    console.log('message:delete ->', data)
    const hasCapability = hasUserCapability(socket.user, 'DELETE_MESSAGE')
    if (!hasCapability) {
      // TODO: make an error and emit to client
      return
    }

    const { messageId, reason } = data || {}
    const response = buildSuccessResponse(socket, {
      messageId,
      reason,
    })

    // to all clients in room (includes the sender)
    io.to(socket.roomId).emit('message:delete', response)
  })

  /*
    Event: Disconnect User
    Request data:
    {
      socketId: '222',
      userId: 'U002',
      reason: 'Kicked by moderator',
    }

    Success Response:
    {
      data: {
        kickedUserId: 'U002',
        reason: 'Kicked by moderator',
        socketId: '123',
        roomId: 'R001',
        sendTime: '2022-12-02T08:25:51.999Z',
        sender: {
          userId: 'U001',
          username: 'JD',
          fullName: 'John Doe',
          color: '#FFBF00'
        },
      }
    }
  */
  socket.on('user:disconnect', async (data) => {
    console.log('user:disconnect ->', data)
    const hasCapability = hasUserCapability(socket.user, 'DISCONNECT_USER')
    if (!hasCapability) {
      // TODO: make an error and emit to client
      return
    }

    const { socketId, userId, reason } = data || {}
    /*
      1. remove session and user in redis
      2. leave client socket in room
      3. disconnect client socket from server
    */
    chatStore.deleteSession(socket.roomId, userId)
    chatStore.deleteUser(socket.roomId, userId)

    // io.sockets.sockets.get(socketId).leave(socket.roomId)
    const allSockets = await io.in(socket.roomId).fetchSockets()
    for (const sk of allSockets) {
      if (sk.id === socketId) {
        sk.leave(socket.roomId)
        sk.disconnect(true)
      }
    }

    const response = buildSuccessResponse(socket, {
      kickedUserId: userId,
      reason,
    })

    // to all clients in room (includes the sender)
    io.to(socket.roomId).emit('user:disconnect', response)
  })
}

module.exports = {
  useAuth,
  handleConnection,
}
