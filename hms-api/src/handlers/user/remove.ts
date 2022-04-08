import {Uuid} from '../../util/uuids';
import {UserDeleteResponse} from '../../rest/user';
import {buildResponse} from '../../rest/responses';

// eslint-disable-next-line require-jsdoc
export function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  const response = buildResponse(200, new UserDeleteResponse(id));

  callback(null, response);
}
