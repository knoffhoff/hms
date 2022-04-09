import {Uuid} from '../../util/uuids';
import {buildResponse} from '../../rest/responses';
import {getUser} from '../../repository/user-repository';
import UserResponse from '../../rest/UserResponse';
import {mapRolesToStrings} from '../../repository/domain/Role';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  const id: Uuid = event.pathParameters.id;
  const user = await getUser(id);

  if (user) {
    const responseBody = new UserResponse(
        user.id,
        user.lastName,
        user.firstName,
        user.emailAddress,
        mapRolesToStrings(user.roles),
        user.skills,
        user.imageUrl,
        user.creationDate,
    );

    callback(null, buildResponse(200, responseBody));
  } else {
    callback(null, buildResponse(404, {}));
  }
}
