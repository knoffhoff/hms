import {
  buildDeletionErrorResponse,
  buildErrorResponse,
  buildInvalidStateErrorResponse,
  buildNotFoundErrorResponse,
  buildReferenceNotFoundErrorResponse,
  buildValidationErrorResponse,
} from '../rest/responses'
import NotFoundError from '../error/NotFoundError'
import ReferenceNotFoundError from '../error/ReferenceNotFoundError'
import InvalidStateError from '../error/InvalidStateError'
import ValidationError from '../error/ValidationError'
import DeletionError from '../error/DeletionError'

// eslint-disable-next-line require-jsdoc
export async function wrapHandler(
  fun: () => void,
  callback: Function,
): Promise<void> {
  try {
    await fun()
  } catch (e) {
    if (e instanceof ReferenceNotFoundError) {
      callback(null, buildReferenceNotFoundErrorResponse(e))
    } else if (e instanceof NotFoundError) {
      callback(null, buildNotFoundErrorResponse(e))
    } else if (e instanceof InvalidStateError) {
      callback(null, buildInvalidStateErrorResponse(e))
    } else if (e instanceof ValidationError) {
      callback(null, buildValidationErrorResponse(e))
    } else if (e instanceof DeletionError) {
      callback(null, buildDeletionErrorResponse(e))
    } else {
      callback(null, buildErrorResponse(e))
    }
  }
}
