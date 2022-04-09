import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import UserDeleteResponse from '../../rest/UserDeleteResponse';
import {removeUser} from '../../repository/user-repository';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  const id: Uuid = event.pathParameters.id;

  await removeUser(id);

  callback(null, buildResponse(200, new UserDeleteResponse(id)));
}
