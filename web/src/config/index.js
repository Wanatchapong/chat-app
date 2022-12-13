const config = {
  env: process.env.NODE_ENV || '',
  socketServer: process.env.REACT_APP_SOCKET_SERVER || '',
  socketToken: process.env.REACT_APP_SOCKET_TOKEN || '',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '',
}

export default config
