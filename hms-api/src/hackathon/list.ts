'use strict';

import {hackathonIds} from '../mock/hackathon';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(hackathonIds),
  };

  callback(null, response);
}
