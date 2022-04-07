'use strict';

import {uuid} from '../../util/uuids';
import {HackathonCreateRequest, HackathonCreateResponse,} from '../../rest/hackathon';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: HackathonCreateRequest = JSON.parse(event.body);

  const hackathonCreateResponse = new HackathonCreateResponse(
      uuid(),
      request.title,
      request.startDate,
      request.endDate,
      new Date(),
  );
  const response = buildResponse(201, hackathonCreateResponse);

  callback(null, response);
}
