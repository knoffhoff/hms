import { buildResponse } from '../../rest/responses'
import { wrapHandler } from '../handler-wrapper'
import Uuid from '../../util/Uuid'
import { removeIdeaComment } from '../../service/idea-comment-service'
import IdeaCommentDeleteResponse from '../../rest/ideaComment/IdeaCommentDeleteResponse'

export async function remove(event, context, callback) {
  await wrapHandler(async () => {
    const id: Uuid = event.pathParameters.id
    await removeIdeaComment(id)
    callback(null, buildResponse(200, new IdeaCommentDeleteResponse(id)))
  }, callback)
}
