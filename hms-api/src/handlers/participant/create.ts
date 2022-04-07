'use strict';

import {uuid} from '../../util/uuids';
import {
  ParticipantCreateRequest,
  ParticipantCreateResponse,
} from '../../rest/participant';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: ParticipantCreateRequest = JSON.parse(event.body);

  const userCreateResponse = new ParticipantCreateResponse(
      uuid(),
      request.userId,
      request.hackathonId,
      new Date(),
  );
  const response = buildResponse(200, userCreateResponse);

  callback(null, response);
}
