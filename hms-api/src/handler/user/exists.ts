import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {getUserExistsResponse} from '../../service/user-service';

// eslint-disable-next-line require-jsdoc
export async function exists(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getUserExistsResponse(
        event.pathParameters.email,
    );
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
