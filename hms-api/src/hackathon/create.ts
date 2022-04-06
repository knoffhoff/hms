'use strict';

import {HackathonCreateRequest, HackathonCreateResponse, uuid,} from '../core';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: HackathonCreateRequest = JSON.parse(event.body);

  const response = {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(new HackathonCreateResponse(
        uuid(),
        request.title,
        request.startDate,
        request.endDate,
        new Date(),
    )),
  };
  callback(null, response);
}
