/* eslint-disable require-jsdoc */

class ReferenceNotFoundError extends Error {
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ReferenceNotFoundError.prototype)
  }
}

export default ReferenceNotFoundError
