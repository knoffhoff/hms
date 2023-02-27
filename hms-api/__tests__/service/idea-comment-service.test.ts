import * as userRepository from '../../src/repository/user-repository';
import * as ideaCommentRepository from '../../src/repository/idea-comment-repository';
import * as ideaRepository from '../../src/repository/idea-repository';
import {
  createIdeaComment,
  getIdeaCommentListResponse,
  getIdeaCommentResponse,
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
import {randomUser} from '../repository/domain/user-maker';
import ValidationError from '../../src/error/ValidationError';
import IdeaCommentListResponse from '../../src/rest/ideaComment/IdeaCommentListResponse';
import NotFoundError from '../../src/error/NotFoundError';

const mockPutIdeaComment = jest.fn();
jest
  .spyOn(ideaCommentRepository, 'putIdeaComment')
  .mockImplementation(mockPutIdeaComment);
const mockUserExists = jest.fn();
jest.spyOn(userRepository, 'userExists').mockImplementation(mockUserExists);
const mockIdeaExists = jest.fn();
jest.spyOn(ideaRepository, 'ideaExists').mockImplementation(mockIdeaExists);
const mockGetUser = jest.fn();
jest.spyOn(userRepository, 'getUser').mockImplementation(mockGetUser);
const mockGetIdea = jest.fn();
jest.spyOn(ideaRepository, 'getIdea').mockImplementation(mockGetIdea);
const mockGetIdeaComment = jest.fn();
jest
  .spyOn(ideaCommentRepository, 'getIdeaComment')
  .mockImplementation(mockGetIdeaComment);
const mockGetUsers = jest.fn();
jest.spyOn(userRepository, 'getUsers').mockImplementation(mockGetUsers);
const mockListIdeaComments = jest.fn();
jest
  .spyOn(ideaCommentRepository, 'listIdeaComments')
  .mockImplementation(mockListIdeaComments);

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
});

describe('Get Idea Comment', () => {
  test('Happy Path', async () => {
    const user = randomUser();
    const idea = randomIdea();
    const ideaComment = makeIdeaComment({ideaId: idea.id} as IdeaCommentData);

    const expected = IdeaCommentResponse.from(ideaComment, user);

    mockGetUser.mockResolvedValueOnce(user);
    mockGetIdeaComment.mockResolvedValueOnce(ideaComment);
    mockGetIdea.mockResolvedValueOnce(idea);

    expect(await getIdeaCommentResponse(ideaComment.id)).toEqual(expected);
  });

  test('Missing User', async () => {
    const idea = randomIdea();
    const ideaComment = makeIdeaComment({ideaId: idea.id} as IdeaCommentData);

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
    const user = randomUser();
    const ideaComment = makeIdeaComment({userId: user.id} as IdeaCommentData);

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
});
