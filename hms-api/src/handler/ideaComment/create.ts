import {buildResponse} from '../../rest/responses';
import {createIdeaComment} from '../../service/idea-comment-service';
import {wrapHandler} from '../handler-wrapper';
import IdeaCommentCreateRequest from '../../rest/ideaComment/IdeaCommentCreateRequest';
import IdeaCommentCreateResponse from '../../rest/ideaComment/IdeaCommentCreateResponse';

export async function create(event, context, callback) {
  await wrapHandler(async () => {
    const request = IdeaCommentCreateRequest.parse(event.body);
    const ideaId = event.pathParameters.id;
    const ideaComment = await createIdeaComment(
      request.userId,
      ideaId,
      request.text,
      request.parentIdeaCommentId,
    );

    callback(
      null,
      buildResponse(201, new IdeaCommentCreateResponse(ideaComment.id)),
    );
  }, callback);
}
