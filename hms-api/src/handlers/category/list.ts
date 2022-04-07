'use strict';

import {Uuid} from '../../util/uuids';
import {getCategories} from '../../mock/category';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, getCategories(id));

  callback(null, response);
}
