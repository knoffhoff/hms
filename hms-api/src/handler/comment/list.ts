import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import {getCommentListResponse} from '../../service/idea_comment-service';

export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId: Uuid = event.pathParameters.id;
    const responseBody = await getCommentListResponse(ideaId);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
