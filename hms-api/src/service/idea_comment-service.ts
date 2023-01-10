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
} from '../repository/idea_comment-repository';
import ValidationError from '../error/ValidationError';
import Comment from '../repository/domain/IdeaComment';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import CommentResponse from '../rest/Comment/CommentResponse';
import CommentDeleteResponse from '../rest/Comment/CommentDeleteResponse';
import CommentListResponse from '../rest/Comment/CommentListResponse';
import ideaComment from '../repository/domain/IdeaComment';

export async function createComment(
  userId: Uuid,
  ideaId: Uuid,
  text: string,
  replyTo: Uuid,
): Promise<Comment> {
  if (!(await ideaExists(ideaId))) {
    throw new NotFoundError(`Idea with id: ${ideaId} not found`);
  } else if (replyTo && !(await commentAlreadyExists(replyTo))) {
    throw new NotFoundError(`Comment with id: ${replyTo} not found`);
  } else if (!(await userExists(userId))) {
    throw new NotFoundError(`User with id: ${userId} not found`);
  }

  const comment = new Comment(userId, ideaId, text, replyTo);
  const result = comment.validate();
  if (result.hasFailed()) {
    throw new ValidationError('Cannot create Comment', result);
  }

  await putComment(comment);

  return comment;
}

export async function getCommentResponse(id: Uuid): Promise<CommentResponse> {
  const comment = await getComment(id);

  let user;
  try {
    user = await getUser(comment.userId);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment with id ${id}, ` +
        `unable to get User with id ${comment.userId}`,
    );
  }

  let idea;
  try {
    idea = await getIdea(comment.ideaId);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment with id ${id}, ` +
        `unable to get Idea with id ${comment.ideaId}`,
    );
  }

  return CommentResponse.from(comment, user);
}

export async function getCommentListResponse(
  ideaId: Uuid,
): Promise<CommentListResponse> {
  if (!(await ideaExists(ideaId))) {
    throw new NotFoundError(`Idea with id: ${ideaId} not found`);
  }

  const comments = await listComments(ideaId);

  //Todo: evaluate how we handle comments with deleted users
  let users;
  try {
    users = await Promise.all(
      comments.map((comment) => getUser(comment.userId)),
    );
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Comment list, ` +
        `unable to get User with id ${users.userId}`,
    );
  }

  return CommentListResponse.from(comments, users, ideaId);
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
  const comments = await listComments(ideaId);
  for (const comment of comments) {
    await deleteComment(comment.id);
  }
}
