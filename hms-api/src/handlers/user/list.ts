import {buildResponse} from '../../rest/responses';
import {listUsers} from '../../repository/user-repository';
import UserListResponse from '../../rest/UserListResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  const users = await listUsers();
  const userIds = users.map((user) => user.id);
  callback(null, buildResponse(200, new UserListResponse(userIds)));
}
