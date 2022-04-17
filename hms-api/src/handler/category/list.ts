import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {getCategoryListResponse} from '../../service/category-service';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getCategoryListResponse(
        event.pathParameters.hackathonId);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
