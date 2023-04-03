import Uuid from '../../util/Uuid'
import IdeaComment from '../../repository/domain/IdeaComment'
import UserPreviewResponse from '../user/UserPreviewResponse'
import User from '../../repository/domain/User'

class IdeaCommentResponse {
  id: Uuid
  user: UserPreviewResponse
  ideaId: Uuid
  text: string
  creationDate: Date
  parentIdeaCommentId?: Uuid

  constructor(
    id: Uuid,
    user: UserPreviewResponse,
    ideaId: Uuid,
    text: string,
    creationDate: Date,
    parentIdeaCommentId?: Uuid,
  ) {
    this.id = id
    this.user = user
    this.ideaId = ideaId
    this.text = text
    this.creationDate = creationDate
    this.parentIdeaCommentId = parentIdeaCommentId
  }

  static from = (ideaComment: IdeaComment, user: User): IdeaCommentResponse =>
    new IdeaCommentResponse(
      ideaComment.id,
      user ? UserPreviewResponse.from(user) : null,
      ideaComment.ideaId,
      ideaComment.text,
      ideaComment.creationDate,
      ideaComment.parentIdeaCommentId,
    )

  static fromArray(
    ideaComments: IdeaComment[],
    users: User[],
  ): IdeaCommentResponse[] {
    const previews: IdeaCommentResponse[] = []
    for (const ideaComment of ideaComments) {
      previews.push(
        IdeaCommentResponse.from(
          ideaComment,
          users.find((user) => user.id === ideaComment.userId),
        ),
      )
    }
    return previews.sort(this.compare)
  }

  static compare(a: IdeaCommentResponse, b: IdeaCommentResponse): number {
    const diff = a.creationDate.getTime() - b.creationDate.getTime()
    if (diff) {
      return diff
    }

    return a.id.localeCompare(b.id)
  }
}

export default IdeaCommentResponse
