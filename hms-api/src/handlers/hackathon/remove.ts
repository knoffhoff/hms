'use strict';

import {Uuid} from '../../util/uuids';
import {HackathonDeleteResponse} from '../../rest/hackathon';
import {buildResponse} from '../../rest/responses';
import {removeHackathon} from '../../repository/dynamoDb';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  await removeHackathon(id);

  const response = buildResponse(200, new HackathonDeleteResponse(id));

  callback(null, response);
}
