/* eslint-disable require-jsdoc */

import NotFoundError from '../repository/error/NotFoundError';
import ReferenceNotFoundError from '../repository/error/ReferenceNotFoundError';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'content-type': 'application/json',
};

export function buildResponse(statusCode: number, bodyObject: any): Object {
  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(bodyObject),
  };
}

export function buildReferenceNotFoundErrorResponse(
    error: ReferenceNotFoundError): Object {
  return buildResponse(400, {
    errorMessage: error.message,
  });
}

export function buildNotFoundErrorResponse(error: NotFoundError): Object {
  return buildResponse(404, {
    errorMessage: error.message,
  });
}

export function buildErrorResponse(error: Error): Object {
  return buildResponse(500, {
    errorMessage: error.message,
  });
}
