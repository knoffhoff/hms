import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import CommentEditRequest from '../../rest/comment/CommentEditRequest';
import {editComment} from '../../service/idea_comment-service';
import CommentEditResponse from '../../rest/comment/CommentEditResponse';

export async function edit(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const request = CommentEditRequest.parse(event.body);

    await editComment(id, request.text);

    callback(null, buildResponse(200, new CommentEditResponse(id)));
  }, callback);
}
