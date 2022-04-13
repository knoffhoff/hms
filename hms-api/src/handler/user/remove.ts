import {buildResponse} from '../../rest/responses';
import {removeUser} from '../../repository/user-repository';
import {wrapHandler} from '../handler-wrapper';
import {Uuid} from '../../util/uuids';
import UserDeleteResponse from '../../rest/UserDeleteResponse';

// eslint-disable-next-line require-jsdoc
export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    await removeUser(id);
    callback(null, buildResponse(200, new UserDeleteResponse(id)));
  }, callback);
}
