/* eslint-disable require-jsdoc */

export function buildResponse(statusCode: number, bodyObject: any): Object {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'content-type': 'application/json',
    },
    body: JSON.stringify(bodyObject),
  };
}
