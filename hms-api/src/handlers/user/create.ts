'use strict';

import {uuid} from '../../util/uuids';
import {UserCreateRequest, UserCreateResponse} from '../../rest/user';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: UserCreateRequest = JSON.parse(event.body);

  const userCreateResponse = new UserCreateResponse(
      uuid(),
      request.lastName,
      request.firstName,
      request.emailAddress,
      request.roles,
      request.skills,
      request.imageUrl,
      new Date(),
  );
  const response = buildResponse(200, userCreateResponse);

  callback(null, response);
}
