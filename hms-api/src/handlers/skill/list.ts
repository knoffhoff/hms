'use strict';

import {skills} from '../../mock/skill';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const response = buildResponse(200, skills);

  callback(null, response);
}
