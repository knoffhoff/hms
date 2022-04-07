'use strict';

import {Uuid} from '../../util/uuids';
import {IdeaDeletionResponse} from '../../rest/idea';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, new IdeaDeletionResponse(id));

  callback(null, response);
}
