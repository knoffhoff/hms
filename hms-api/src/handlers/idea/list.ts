import {Uuid} from '../../util/uuids';
import {getIdeas} from '../../mock/idea';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function list(event, context, callback) {
  const hackathonId: Uuid = event.pathParameters.hackathonId;

  const response = buildResponse(200, getIdeas(hackathonId));

  callback(null, response);
}
