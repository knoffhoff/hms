import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {getIdeaCommentResponse} from '../../service/idea-comment-service';

export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getIdeaCommentResponse(event.pathParameters.id);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
