'use strict';

import {Uuid} from '../../util/uuids';
import {getIdeas} from '../../mock/idea';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, getIdeas(id));

  callback(null, response);
}
