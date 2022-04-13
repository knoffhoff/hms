import {buildResponse} from '../../rest/responses';
import {listUsers} from '../../repository/user-repository';
import {wrapHandler} from '../handler-wrapper';
import UserListResponse from '../../rest/UserListResponse';
import UserPreviewResponse from '../../rest/UserPreviewResponse';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const previews = UserPreviewResponse.fromArray(await listUsers());
    callback(null, buildResponse(200, new UserListResponse(previews)));
  }, callback);
}
