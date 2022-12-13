const uuidv4 = () => {
  // eslint-disable-next-line
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const hasUserCapability = (user, allowedCapability) => {
  return (
    user &&
    Array.isArray(user.capabilities) &&
    user.capabilities.includes(allowedCapability)
  )
}

const toUserResponse = (user) => {
  const { capabilities, ...otherProps } = user || {}
  return { ...otherProps }
}

module.exports = {
  uuidv4,
  hasUserCapability,
  toUserResponse,
}
