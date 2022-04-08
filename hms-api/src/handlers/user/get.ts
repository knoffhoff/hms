import {Uuid} from '../../util/uuids';
import {getUser} from '../../mock/user';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, getUser(id));

  callback(null, response);
}
