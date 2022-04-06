'use strict';

import {Uuid} from '../uuids';
import {HackathonDeleteResponse} from '../rest/hackathon';

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
