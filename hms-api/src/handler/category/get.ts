import {buildResponse} from '../../rest/responses';
import {getCategoryResponse} from '../../service/category-service';
import {wrapHandler} from '../handler-wrapper';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getCategoryResponse(event.pathParameters.id);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
