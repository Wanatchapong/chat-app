module.exports = function notFoundHandler(req, res, next) {
  res.status(404).json({
    error: {
      code: 'request_not_found',
      message: `the requested [${req.method}] ${req.originalUrl} was not found`,
    },
  })
}
