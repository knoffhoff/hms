'use strict';

import {HackathonDeleteResponse, Uuid} from '../core';

// eslint-disable-next-line require-jsdoc
export function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(new HackathonDeleteResponse(id)),
  };

  callback(null, response);
}
