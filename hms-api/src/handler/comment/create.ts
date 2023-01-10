import {buildResponse} from '../../rest/responses';
import {createComment} from '../../service/idea_comment-service';
import {wrapHandler} from '../handler-wrapper';
import CommentCreateRequest from '../../rest/Comment/CommentCreateRequest';
import CommentCreateResponse from '../../rest/Comment/CommentCreateResponse';

export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request = CommentCreateRequest.parse(event.body);
    const comment = await createComment(
      request.ideaId,
      request.userId,
      request.text,
      request.replyTo,
    );

    callback(null, buildResponse(201, new CommentCreateResponse(comment.id)));
  }, callback);
}
