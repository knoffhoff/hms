'use strict';

import {Uuid} from '../../util/uuids';
import {getHackathon} from '../../mock/hackathon';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, getHackathon(id));

  callback(null, response);
}
