import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import {getIdeaCommentListResponse} from '../../service/idea-comment-service';

export async function list(event, context, callback) {
  await wrapHandler(async () => {
    const ideaId: Uuid = event.pathParameters.id;
    const responseBody = await getIdeaCommentListResponse(ideaId);
    callback(null, buildResponse(200, responseBody));
  }, callback);
}
