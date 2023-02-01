import {buildResponse} from '../../rest/responses';
import {wrapHandler} from '../handler-wrapper';
import Uuid from '../../util/Uuid';
import IdeaCommentEditRequest from '../../rest/ideaComment/IdeaCommentEditRequest';
import {editIdeaComment} from '../../service/idea-comment-service';
import IdeaCommentEditResponse from '../../rest/ideaComment/IdeaCommentEditResponse';

export async function edit(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id;
    const request = IdeaCommentEditRequest.parse(event.body);

    await editIdeaComment(id, request.text);

    callback(null, buildResponse(200, new IdeaCommentEditResponse(id)));
  }, callback);
}
