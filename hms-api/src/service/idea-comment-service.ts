import Uuid from '../util/Uuid';
import NotFoundError from '../error/NotFoundError';
import {getIdea, ideaExists} from '../repository/idea-repository';
import {getUser, userExists} from '../repository/user-repository';
import {
  ideaCommentAlreadyExists,
  getIdeaComment,
  putIdeaComment,
  deleteIdeaComment,
  listIdeaComments,
  parentCommentIdIdeaExists,
} from '../repository/idea-comment-repository';
import ValidationError from '../error/ValidationError';
import IdeaComment from '../repository/domain/IdeaComment';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import IdeaCommentResponse from '../rest/ideaComment/IdeaCommentResponse';
import IdeaCommentDeleteResponse from '../rest/ideaComment/IdeaCommentDeleteResponse';
import IdeaCommentListResponse from '../rest/ideaComment/IdeaCommentListResponse';
import ideaComment from '../repository/domain/IdeaComment';

export async function createIdeaComment(
  userId: Uuid,
  ideaId: Uuid,
  text: string,
  parentCommentId?: Uuid,
): Promise<IdeaComment> {
  if (!(await ideaExists(ideaId))) {
    throw new ReferenceNotFoundError(`Idea with id: ${ideaId} not found`);
  }

  if (!(await userExists(userId))) {
    throw new ReferenceNotFoundError(`User with id: ${userId} not found`);
  }

  if (parentCommentId && !(await parentCommentIdIdeaExists(parentCommentId))) {
    throw new ReferenceNotFoundError(
      `Parent comment with id: ${parentCommentId} not found`,
    );
  }

  const ideaComment = new IdeaComment(userId, ideaId, text, parentCommentId);
  const result = ideaComment.validate();
  if (result.hasFailed()) {
    throw new ValidationError('Cannot create Comment', result);
  }

  await putIdeaComment(ideaComment);

  return ideaComment;
}

export async function getIdeaCommentResponse(
  id: Uuid,
): Promise<IdeaCommentResponse> {
  let ideaComment;
  try {
    ideaComment = await getIdeaComment(id);
  } catch (e) {
    throw new NotFoundError(`IdeaComment with id: ${id} not found`);
  }

  let user;
  try {
    user = await getUser(ideaComment.userId);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment with id ${id}, ` +
        `unable to get User with id ${ideaComment.userId}`,
    );
  }

  let Idea;
  try {
    Idea = await getIdea(ideaComment.ideaId);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment with id ${id}, ` +
        `unable to get Idea with id ${ideaComment.ideaId}`,
    );
  }

  return IdeaCommentResponse.from(ideaComment, user);
}

export async function getIdeaCommentListResponse(
  ideaId: Uuid,
): Promise<IdeaCommentListResponse> {
  if (!(await ideaExists(ideaId))) {
    throw new NotFoundError(`Idea with id: ${ideaId} not found`);
  }

  const ideaComments = await listIdeaComments(ideaId);

  //Todo: evaluate how we handle ideaComments with deleted users
  let users;
  try {
    users = await Promise.all(
      ideaComments.map((ideaComment) => getUser(ideaComment.userId)),
    );
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment list, ` +
        `unable to get Users with ids ${ideaComments.map((c) => c.userId)}`,
    );
  }

  return IdeaCommentListResponse.from(ideaComments, users, ideaId);
}

export async function editIdeaComment(id: Uuid, text: string): Promise<void> {
  let existing: ideaComment;
  try {
    existing = await getIdeaComment(id);
    existing.text = text;
  } catch (e) {
    throw new NotFoundError(`Comment with id: ${id} not found`);
  }

  const result = existing.validate();
  if (result.hasFailed()) {
    throw new ValidationError(
      `Cannot edit Comment with id: ${id} because`,
      result,
    );
  }

  await putIdeaComment(existing);
}

export async function removeIdeaComment(
  id: Uuid,
): Promise<IdeaCommentDeleteResponse> {
  await deleteIdeaComment(id);

  return new IdeaCommentDeleteResponse(id);
}

export async function removeIdeaCommentsForIdea(ideaId: Uuid): Promise<void> {
  const ideaComments = await listIdeaComments(ideaId);
  for (const ideaComment of ideaComments) {
    await deleteIdeaComment(ideaComment.id);
  }
}
