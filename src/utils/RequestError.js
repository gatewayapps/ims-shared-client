export default class RequestError extends Error {
  constructor (message) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'RequestError'
    this.message = message
  }
}
