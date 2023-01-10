import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import {getCommentResponse} from '../../service/idea_comment-service';

export async function get(event, context, callback) {
  await wrapHandler(async () => {
    const responseBody = await getCommentResponse(event.pathParameters.id);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
