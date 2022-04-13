import {buildResponse} from '../../rest/responses';
import {createUser} from '../../repository/user-repository';
import {mapStringToRoles} from '../../repository/domain/Role';
import {wrapHandler} from '../handler-wrapper';
import UserCreateRequest from '../../rest/UserCreateRequest';
import UserCreateResponse from '../../rest/UserCreateResponse';
import User from '../../repository/domain/User';

// eslint-disable-next-line require-jsdoc
export async function create(event, context, callback) {
  await wrapHandler(async () => {
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

    callback(null, buildResponse(201, new UserCreateResponse(user.id)));
  }, callback);
}
