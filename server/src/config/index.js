const config = {
  env: process.env.NODE_ENV,
  port: +process.env.PORT || 8000,
  apiBaseURL: process.env.API_BASE_URL || '',
  socketToken: process.env.SOCKET_TOKEN || '',
}

module.exports = config
