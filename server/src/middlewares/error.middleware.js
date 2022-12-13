module.exports = function errorHandler(err, req, res, next) {
  console.error(
    `${req.method} ${req.url} error: ${err.name}, message: ${err.message}`,
  )

  let status = 500
  let code = 'api_error'
  let message = err.message

  res.status(status).json({
    error: {
      code,
      message,
    },
  })
}
