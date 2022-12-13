const jwt = require('jsonwebtoken')

const JWT_SECRET = 'SuperSecret'

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  })
}

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET)
}

module.exports = {
  generateToken,
  verifyToken,
}
