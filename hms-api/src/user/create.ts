'use strict';

import {uuid} from '../uuids';
import {UserCreateRequest, UserCreateResponse} from '../rest/user';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: UserCreateRequest = JSON.parse(event.body);

  // create a response
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(new UserCreateResponse(
        uuid(),
        request.lastName,
        request.firstName,
        request.emailAddress,
        request.roles,
        request.skills,
        request.imageUrl,
        new Date(),
    )),
  };
  callback(null, response);
}
