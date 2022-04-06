'use strict';

import {Uuid} from '../core';
import {getHackathon} from '../mock/hackathon';

// eslint-disable-next-line require-jsdoc
export function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(getHackathon(id)),
  };

  callback(null, response);
}
