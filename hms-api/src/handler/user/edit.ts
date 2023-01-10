import {wrapHandler} from '../handler-wrapper';
import {buildResponse} from '../../rest/responses';
import {editUser} from '../../service/user-service';
import UserEditRequest from '../../rest/User/UserEditRequest';
import UserEditResponse from '../../rest/User/UserEditResponse';
import Uuid from '../../util/Uuid';

// eslint-disable-next-line require-jsdoc
export async function edit(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const request = UserEditRequest.parse(event.body);

    await editUser(
      id,
      request.lastName,
      request.firstName,
      request.skills,
      request.imageUrl,
    );

    callback(null, buildResponse(200, new UserEditResponse(id)));
  }, callback);
}
