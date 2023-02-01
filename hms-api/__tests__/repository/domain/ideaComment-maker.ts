import Uuid, {uuid} from '../../../src/util/Uuid';
import IdeaComment from '../../../src/repository/domain/IdeaComment';

export interface IdeaCommentData {
  id: Uuid;
  userId: Uuid;
  ideaId: Uuid;
  text: string;
  creationDate: Date;
  parentIdeaCommentId?: Uuid;
}

export const makeIdeaComment = ({
  id = uuid(),
  userId = uuid(),
  ideaId = uuid(),
  text = undefined,
  creationDate = new Date(),
  parentIdeaCommentId = uuid(),
}: IdeaCommentData): IdeaComment =>
  new IdeaComment(id, userId, ideaId, text, creationDate, parentIdeaCommentId);

export const randomIdeaComment = (): IdeaComment =>
  makeIdeaComment({} as IdeaCommentData);
