/* eslint-disable require-jsdoc */

import ValidationResult from './ValidationResult';

class ValidationError extends Error {
  constructor(message: string, result: ValidationResult) {
    super(message + '\n' + result.toBulletList());

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export default ValidationError;
