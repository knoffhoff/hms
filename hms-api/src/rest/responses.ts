/* eslint-disable require-jsdoc */

import NotFoundError from '../error/NotFoundError';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import InvalidStateError from '../error/InvalidStateError';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json',
};

export function buildResponse(statusCode: number, bodyObject: any): any {
  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(bodyObject),
  };
}

export function buildReferenceNotFoundErrorResponse(
    error: ReferenceNotFoundError,
): any {
  return buildResponse(400, {
    errorMessage: error.message,
  });
}

export function buildNotFoundErrorResponse(error: NotFoundError): any {
  return buildResponse(404, {
    errorMessage: error.message,
  });
}

export function buildInvalidStateErrorResponse(error: InvalidStateError): any {
  return buildResponse(400, {
    errorMessage: error.message,
  });
}

export function buildErrorResponse(error: Error): any {
  return buildResponse(500, {
    errorMessage: error.message,
  });
}
