'use strict';

import {Uuid} from '../../util/uuids';
import {getIdeas} from '../../mock/idea';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(getIdeas(id)),
  };

  callback(null, response);
}
