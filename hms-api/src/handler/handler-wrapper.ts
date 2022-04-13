import {
  buildErrorResponse,
  buildNotFoundErrorResponse,
} from '../rest/responses';
import NotFoundError from '../repository/error/NotFoundError';

// eslint-disable-next-line require-jsdoc
export async function wrapHandler(fun: Function, callback: Function)
    : Promise<void> {
  try {
    await fun();
  } catch (e) {
    if (e instanceof NotFoundError) {
      callback(null, buildNotFoundErrorResponse(e));
    } else {
      callback(null, buildErrorResponse(e));
    }
  }
}
