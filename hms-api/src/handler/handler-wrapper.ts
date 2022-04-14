import {
  buildErrorResponse,
  buildNotFoundErrorResponse,
  buildReferenceNotFoundErrorResponse,
} from '../rest/responses';
import NotFoundError from '../repository/error/NotFoundError';
import ReferenceNotFoundError from '../repository/error/ReferenceNotFoundError';

// eslint-disable-next-line require-jsdoc
export async function wrapHandler(fun: () => void, callback: Function)
    : Promise<void> {
  try {
    await fun();
  } catch (e) {
    if (e instanceof ReferenceNotFoundError) {
      callback(null, buildReferenceNotFoundErrorResponse(e));
    } else if (e instanceof NotFoundError) {
      callback(null, buildNotFoundErrorResponse(e));
    } else {
      callback(null, buildErrorResponse(e));
    }
  }
}
