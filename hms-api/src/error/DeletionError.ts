/* eslint-disable require-jsdoc */

class DeletionError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, DeletionError.prototype);
  }
}

export default DeletionError;
