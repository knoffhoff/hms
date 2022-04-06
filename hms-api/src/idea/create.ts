'use strict';

import {uuid} from '../uuids';
import {IdeaCreateRequest, IdeaCreateResponse} from '../rest/idea';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: IdeaCreateRequest = JSON.parse(event.body);

  const response = {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(new IdeaCreateResponse(
        uuid(),
        request.ownerId,
        request.hackathonId,
        request.participantIds,
        request.title,
        request.description,
        request.problem,
        request.goal,
        request.requiredSkills,
        request.categoryId,
        new Date(),
    )),
  };

  callback(null, response);
}
