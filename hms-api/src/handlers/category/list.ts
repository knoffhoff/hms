'use strict';

import {Uuid} from '../../util/uuids';
import {getCategories} from '../../mock/category';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;

  const response = buildResponse(200, getCategories(hackathonId));

  callback(null, response);
}
