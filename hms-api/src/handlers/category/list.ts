'use strict';

import {Uuid} from '../../util/uuids';
import {getCategories} from '../../mock/category';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(getCategories(id)),
  };

  callback(null, response);
}
