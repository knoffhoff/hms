'use strict';

// eslint-disable-next-line require-jsdoc
export function buildResponse(statusCode: number, bodyObject: any): Object {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(bodyObject),
  };
}
