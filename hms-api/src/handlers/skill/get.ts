'use strict';

import {getSkill} from '../../mock/skill';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function get(event, context, callback) {
  const name: string = event.pathParameters.name;

  const response = buildResponse(200, getSkill(name));

  callback(null, response);
}
