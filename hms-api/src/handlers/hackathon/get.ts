'use strict';

import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {getHackathon} from '../../repository/dynamoDb';
import {HackathonResponse} from '../../rest/hackathon';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const hackathon = await getHackathon(id);

  // TODO better way to handle missing value
  let responseBody = {};
  if (hackathon) {
    responseBody = new HackathonResponse(
        hackathon.id,
        hackathon.title,
        hackathon.startDate,
        hackathon.endDate,
        hackathon.participantIds,
        hackathon.categoryIds,
        hackathon.ideaIds,
    );
  }

  const response = buildResponse(200, responseBody);

  callback(null, response);
}
