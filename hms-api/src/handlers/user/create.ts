import {buildResponse} from '../../rest/responses';
import UserCreateRequest from '../../rest/UserCreateRequest';
import UserCreateResponse from '../../rest/UserCreateResponse';
import User from '../../repository/domain/User';
import {createUser} from '../../repository/user-repository';
import {mapStringToRoles} from '../../repository/domain/Role';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  const request: UserCreateRequest = JSON.parse(event.body);

  const user = new User(
      request.lastName,
      request.firstName,
      request.emailAddress,
      mapStringToRoles(request.roles),
      request.skills,
      request.imageUrl,
  );
  await createUser(user);

  callback(null, buildResponse(200, new UserCreateResponse(user.id)));
}
