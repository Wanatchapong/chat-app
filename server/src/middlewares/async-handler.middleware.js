module.exports = function asyncHandler(fn) {
  return (...args) => fn(...args).catch(args[args.length - 1])
}
