import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {getIdeaListResponse} from '../../service/idea-service';

// eslint-disable-next-line require-jsdoc
export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const hackathonId = event.pathParameters.hackathonId;
    const responseBody = await getIdeaListResponse(hackathonId);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
