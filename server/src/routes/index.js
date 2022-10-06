const pkgJson = require('../../package.json')
const { apiBaseURL } = require('../config')

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
}

module.exports = initRoutes
