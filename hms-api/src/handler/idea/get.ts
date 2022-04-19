import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {getIdeaResponse} from '../../service/idea-service';

// eslint-disable-next-line require-jsdoc
export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getIdeaResponse(event.pathParameters.id);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
