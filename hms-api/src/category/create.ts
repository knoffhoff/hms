'use strict';

import {CategoryCreateRequest, CategoryCreateResponse, uuid} from '../core';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: CategoryCreateRequest = JSON.parse(event.body);

  // create a response
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(new CategoryCreateResponse(
        uuid(),
        request.title,
        request.description,
        request.hackathonId,
    )),
  };

  callback(null, response);
}
