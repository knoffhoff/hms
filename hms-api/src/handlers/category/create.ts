'use strict';

import {uuid} from '../../util/uuids';
import {
  CategoryCreateRequest,
  CategoryCreateResponse,
} from '../../rest/category';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function create(event, context, callback) {
  const request: CategoryCreateRequest = JSON.parse(event.body);

  const categoryCreateResponse = new CategoryCreateResponse(
      uuid(),
      request.title,
      request.description,
      request.hackathonId,
  );
  const response = buildResponse(200, categoryCreateResponse);

  callback(null, response);
}
