'use strict';

import {getParticipantIds} from '../../mock/participant';
import {buildResponse} from '../../rest/responses';
import {Uuid} from '../../util/uuids';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;

  const response = buildResponse(200, getParticipantIds(hackathonId));

  callback(null, response);
}
