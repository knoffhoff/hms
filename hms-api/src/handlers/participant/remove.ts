'use strict';

import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {ParticipantDeleteResponse} from '../../rest/participant';

// eslint-disable-next-line require-jsdoc
export function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, new ParticipantDeleteResponse(id));

  callback(null, response);
}
