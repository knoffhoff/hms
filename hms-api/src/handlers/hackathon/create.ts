'use strict';

import {
  HackathonCreateRequest,
  HackathonCreateResponse,
} from '../../rest/hackathon';
import {buildResponse} from '../../rest/responses';
import {createHackathon} from '../../repository/dynamoDb';
import {Hackathon} from '../../repository/domain/Hackathon';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  const request: HackathonCreateRequest = JSON.parse(event.body);

  const hackathon = new Hackathon(
      request.title,
      request.startDate,
      request.endDate,
  );
  await createHackathon(hackathon);

  const hackathonCreateResponse = new HackathonCreateResponse(hackathon.id);
  const response = buildResponse(201, hackathonCreateResponse);

  callback(null, response);
}
