import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import {removeComment} from '../../service/idea_comment-service';
import CommentDeleteResponse from '../../rest/comment/CommentDeleteResponse';

export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    await removeComment(id);
    callback(null, buildResponse(200, new CommentDeleteResponse(id)));
  }, callback);
}
