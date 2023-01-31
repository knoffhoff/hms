import Uuid from '../util/Uuid';
import NotFoundError from '../error/NotFoundError';
import {getIdea, ideaExists} from '../repository/idea-repository';
import {getUser, userExists} from '../repository/user-repository';
import {
  commentAlreadyExists,
  getComment,
  putComment,
  deleteComment,
  listComments,
} from '../repository/idea-comment-repository';
import ValidationError from '../error/ValidationError';
import IdeaComment from '../repository/domain/IdeaComment';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import CommentResponse from '../rest/comment/CommentResponse';
import CommentDeleteResponse from '../rest/comment/CommentDeleteResponse';
import CommentListResponse from '../rest/comment/CommentListResponse';
import ideaComment from '../repository/domain/IdeaComment';

export async function createComment(
  ideaId: Uuid,
  userId: Uuid,
  text: string,
  replyTo: Uuid,
): Promise<IdeaComment> {
  const ideaComment = new IdeaComment(userId, ideaId, text, replyTo);

  if (!(await ideaExists(ideaId))) {
    throw new ReferenceNotFoundError(`Idea with id: ${ideaId} not found`);
  }

  if (replyTo && !(await commentAlreadyExists(ideaComment))) {
    throw new ReferenceNotFoundError(`Comment with id: ${replyTo} not found`);
  }

  if (!(await userExists(userId))) {
    throw new ReferenceNotFoundError(`User with id: ${userId} not found`);
  }

  const result = ideaComment.validate();
  if (result.hasFailed()) {
    throw new ValidationError('Cannot create Comment', result);
  }

  await putComment(ideaComment);

  return ideaComment;
}

export async function getCommentResponse(id: Uuid): Promise<CommentResponse> {
  const ideaComment = await getComment(id);

  let user;
  try {
    user = await getUser(ideaComment.userId);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment with id ${id}, ` +
        `unable to get User with id ${ideaComment.userId}`,
    );
  }

  return CommentResponse.from(ideaComment, user);
}

export async function getCommentListResponse(
  ideaId: Uuid,
): Promise<CommentListResponse> {
  if (!(await ideaExists(ideaId))) {
    throw new NotFoundError(`Idea with id: ${ideaId} not found`);
  }

  const ideaComments = await listComments(ideaId);

  //Todo: evaluate how we handle ideaComments with deleted users
  let users;
  try {
    users = await Promise.all(
      ideaComments.map((comment) => getUser(comment.userId)),
    );
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment list, ` +
        `unable to get User with id ${ideaComments.map((c) => c.userId)}`,
    );
  }

  return CommentListResponse.from(ideaComments, users, ideaId);
}

export async function editComment(id: Uuid, text: string): Promise<void> {
  let existing: ideaComment;
  try {
    existing = await getComment(id);
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

  await putComment(existing);
}

export async function removeComment(id: Uuid): Promise<CommentDeleteResponse> {
  await deleteComment(id);

  return new CommentDeleteResponse(id);
}

export async function removeCommentsForIdea(ideaId: Uuid): Promise<void> {
  const ideaComments = await listComments(ideaId);
  for (const comment of ideaComments) {
    await deleteComment(comment.id);
  }
}
