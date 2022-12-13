const redisClient = require('./redis')

const USER_TTL = 24 * 60 * 60 // 24 hours
const SESSION_TTL = 12 * 60 * 60 // 12 hours

const getUserKey = (roomId, userId) => {
  return `chat:user:${roomId}_${userId}`
}

const getSessionKey = (roomId, userId) => {
  return `chat:session:${roomId}_${userId}`
}

const existsUser = async (roomId, userId) => {
  const key = getUserKey(roomId, userId)
  return redisClient.exists(key)
}

const saveUser = async (data) => {
  const key = getUserKey(data.roomId, data.userId)
  return redisClient
    .multi()
    .setNX(key, JSON.stringify(data))
    .expire(key, USER_TTL)
    .exec()
}

const findUser = async (roomId, userId) => {
  const key = getUserKey(roomId, userId)
  const value = await redisClient.get(key)
  return value ? JSON.parse(value) : null
}

const deleteUser = async (roomId, userId) => {
  const key = getUserKey(roomId, userId)
  return redisClient.del(key)
}

const saveSession = async ({ roomId, userId, token }) => {
  const key = getSessionKey(roomId, userId)
  return redisClient
    .multi()
    .hSet(key, { roomId, userId, token })
    .expire(key, SESSION_TTL)
    .exec()
}

const findSession = async (roomId, userId) => {
  const key = getSessionKey(roomId, userId)
  return redisClient.hGetAll(key)
}

const deleteSession = async (roomId, userId) => {
  const key = getSessionKey(roomId, userId)
  return redisClient.del(key)
}

module.exports = {
  existsUser,
  saveUser,
  findUser,
  deleteUser,
  saveSession,
  findSession,
  deleteSession,
}
