'use strict';

import {Uuid} from '../../util/uuids';
import {HackathonDeleteResponse} from '../../rest/hackathon';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, new HackathonDeleteResponse(id));

  callback(null, response);
}
