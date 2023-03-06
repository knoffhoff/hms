import * as userRepository from '../../src/repository/user-repository';
import * as ideaCommentRepository from '../../src/repository/idea-comment-repository';
import * as ideaRepository from '../../src/repository/idea-repository';
import {
  createIdeaComment,
  editIdeaComment,
  getIdeaCommentListResponse,
  getIdeaCommentResponse,
  removeIdeaComment,
} from '../../src/service/idea-comment-service';
import {uuid} from '../../src/util/Uuid';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import {randomIdea} from '../repository/domain/idea-maker';
import {
  IdeaCommentData,
  makeIdeaComment,
  randomIdeaComment,
} from '../repository/domain/ideaComment-maker';
import IdeaCommentResponse from '../../src/rest/ideaComment/IdeaCommentResponse';
import {makeUser, randomUser, UserData} from '../repository/domain/user-maker';
import NotFoundError from '../../src/error/NotFoundError';
import ValidationError from '../../src/error/ValidationError';
import IdeaCommentListResponse from '../../src/rest/ideaComment/IdeaCommentListResponse';
import IdeaComment from '../../src/repository/domain/IdeaComment';
import {deleteIdeaComment} from '../../src/repository/idea-comment-repository';

const mockPutIdeaComment = jest
  .spyOn(ideaCommentRepository, 'putIdeaComment')
  .mockImplementation();
const mockGetIdeaComment = jest
  .spyOn(ideaCommentRepository, 'getIdeaComment')
  .mockImplementation();
const mockGetIdeaCommentList = jest
  .spyOn(ideaCommentRepository, 'listIdeaComments')
  .mockImplementation();
const mockDeleteIdeaComment = jest
  .spyOn(ideaCommentRepository, 'deleteIdeaComment')
  .mockImplementation();

const mockUserExists = jest
  .spyOn(userRepository, 'userExists')
  .mockImplementation();
const mockGetUser = jest.spyOn(userRepository, 'getUser').mockImplementation();

const mockIdeaExists = jest
  .spyOn(ideaRepository, 'ideaExists')
  .mockImplementation();
const mockGetIdea = jest.spyOn(ideaRepository, 'getIdea').mockImplementation();

describe('Create Idea Comment without parentComment', () => {
  test('Happy Path', async () => {
    mockUserExists.mockResolvedValueOnce(true);
    mockIdeaExists.mockResolvedValueOnce(true);

    const expected = randomIdeaComment();

    expect(
      await createIdeaComment(expected.userId, expected.ideaId, expected.text),
    ).toEqual(
      expect.objectContaining({
        userId: expected.userId,
        ideaId: expected.ideaId,
        text: expected.text,
      }),
    );

    expect(mockPutIdeaComment).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: expected.userId,
        ideaId: expected.ideaId,
        text: expected.text,
      }),
    );
  });

  test('Missing User', async () => {
    mockUserExists.mockResolvedValueOnce(false);
    mockIdeaExists.mockResolvedValueOnce(true);

    await expect(
      createIdeaComment(uuid(), uuid(), 'ideaComment', uuid()),
    ).rejects.toThrow(ReferenceNotFoundError);

    expect(mockPutIdeaComment).not.toHaveBeenCalled();
  });

  test('Missing Idea', async () => {
    mockUserExists.mockResolvedValueOnce(true);
    mockIdeaExists.mockResolvedValueOnce(false);

    await expect(
      createIdeaComment(uuid(), uuid(), 'ideaComment', uuid()),
    ).rejects.toThrowError(ReferenceNotFoundError);

    expect(mockPutIdeaComment).not.toHaveBeenCalled();
  });

  test('Validation Error', async () => {
    mockUserExists.mockResolvedValueOnce(true);
    mockIdeaExists.mockResolvedValueOnce(true);

    await expect(
      createIdeaComment(uuid(), uuid(), '', uuid()),
    ).rejects.toThrowError(ValidationError);

    expect(mockPutIdeaComment).not.toHaveBeenCalled();
  });
});

describe('Edit Idea Comment', () => {
  test('Happy Path', async () => {
    const oldComment = randomIdeaComment();
    const text = 'new text';
    const expected = new IdeaComment(
      oldComment.userId,
      oldComment.ideaId,
      text,
      oldComment.parentIdeaCommentId,
      oldComment.id,
      oldComment.creationDate,
    );

    mockGetIdeaComment.mockResolvedValueOnce(oldComment);

    await editIdeaComment(oldComment.id, text);

    expect(mockPutIdeaComment).toHaveBeenCalledWith(expected);
  });

  test('Missing Idea Comment', async () => {
    const ideaComment = randomIdeaComment();

    mockGetIdeaComment.mockReset();
    mockGetIdeaComment.mockImplementation(() => {
      throw new NotFoundError('Idea Comment not found');
    });

    await expect(
      editIdeaComment(ideaComment.id, ideaComment.text),
    ).rejects.toThrow(NotFoundError);

    expect(mockPutIdeaComment).not.toHaveBeenCalled();
  });

  test('Validation Error', async () => {
    const ideaComment = randomIdeaComment();
    mockUserExists.mockResolvedValueOnce(true);
    mockIdeaExists.mockResolvedValueOnce(true);

    mockGetIdeaComment.mockResolvedValueOnce(ideaComment);

    await expect(editIdeaComment(ideaComment.id, '')).rejects.toThrowError(
      ValidationError,
    );

    expect(mockPutIdeaComment).not.toHaveBeenCalled();
  });
});

describe('Get Idea Comment', () => {
  const user = randomUser();
  const idea = randomIdea();
  const ideaComment = makeIdeaComment({ideaId: idea.id} as IdeaCommentData);

  test('Happy Path', async () => {
    const expected = IdeaCommentResponse.from(ideaComment, user);

    mockGetUser.mockResolvedValueOnce(user);
    mockGetIdeaComment.mockResolvedValueOnce(ideaComment);
    mockGetIdea.mockResolvedValueOnce(idea);

    expect(await getIdeaCommentResponse(ideaComment.id)).toEqual(expected);
  });

  test('Missing User', async () => {
    mockGetIdeaComment.mockResolvedValueOnce(ideaComment);
    mockGetIdea.mockResolvedValueOnce(idea);
    mockGetUser.mockImplementation(() => {
      throw new NotFoundError('User not found');
    });

    await expect(getIdeaCommentResponse(ideaComment.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Idea', async () => {
    mockGetUser.mockResolvedValueOnce(user);
    mockGetIdeaComment.mockResolvedValueOnce(ideaComment);
    mockGetIdea.mockReset();
    mockGetIdea.mockImplementation(() => {
      throw new NotFoundError('Idea not found');
    });

    await expect(getIdeaCommentResponse(ideaComment.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });

  test('Missing Idea Comment', async () => {
    mockGetUser.mockResolvedValueOnce(user);
    mockGetIdea.mockResolvedValueOnce(idea);
    mockGetIdeaComment.mockReset();
    mockGetIdeaComment.mockImplementation(() => {
      throw new NotFoundError('Idea Comment not found');
    });

    await expect(getIdeaCommentResponse(ideaComment.id)).rejects.toThrow(
      NotFoundError,
    );

    expect(mockGetIdeaComment).toHaveBeenCalledWith(ideaComment.id);
  });
});

describe('Get Idea Comment List', () => {
  const idea = randomIdea();
  const ideaComment1 = makeIdeaComment({ideaId: idea.id} as IdeaCommentData);
  const ideaComment2 = makeIdeaComment({ideaId: idea.id} as IdeaCommentData);
  const user1 = makeUser({id: ideaComment1.userId} as UserData);
  const user2 = makeUser({id: ideaComment2.userId} as UserData);

  test('Happy Path', async () => {
    const ideaCommentListResponse = IdeaCommentListResponse.from(
      [ideaComment1, ideaComment2],
      [user1, user2],
      idea.id,
    );

    mockIdeaExists.mockResolvedValueOnce(true);
    mockGetIdeaCommentList.mockResolvedValueOnce([ideaComment1, ideaComment2]);
    mockGetUser.mockResolvedValueOnce(user1);
    mockGetUser.mockResolvedValueOnce(user2);

    expect(await getIdeaCommentListResponse(idea.id)).toStrictEqual(
      ideaCommentListResponse,
    );
  });

  test('Missing Idea', async () => {
    mockGetIdeaCommentList.mockResolvedValueOnce([ideaComment1, ideaComment2]);
    mockGetIdea.mockReset();
    mockGetIdea.mockImplementation(() => {
      throw new NotFoundError('Idea not found');
    });

    await expect(getIdeaCommentListResponse(idea.id)).rejects.toThrow(
      NotFoundError,
    );
  });

  test('Missing User', async () => {
    mockIdeaExists.mockResolvedValueOnce(true);
    mockGetIdeaCommentList.mockResolvedValueOnce([ideaComment1, ideaComment2]);
    mockGetUser.mockImplementation(() => {
      throw new NotFoundError('User not found');
    });

    await expect(getIdeaCommentListResponse(idea.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
  });
});

describe('Delete Idea Comment', () => {
  test('Happy Path', async () => {
    const ideaComment = randomIdeaComment();

    mockGetIdeaComment.mockResolvedValueOnce(ideaComment);

    await removeIdeaComment(ideaComment.id);

    expect(mockDeleteIdeaComment).toHaveBeenCalledWith(ideaComment.id);
  });
});
