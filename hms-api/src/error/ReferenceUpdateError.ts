/* eslint-disable require-jsdoc */

class ReferenceUpdateError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ReferenceUpdateError.prototype);
  }
}

export default ReferenceUpdateError;
