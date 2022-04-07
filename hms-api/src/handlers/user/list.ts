'use strict';

import {userIds} from '../../mock/user';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const response = buildResponse(200, userIds);

  callback(null, response);
}
