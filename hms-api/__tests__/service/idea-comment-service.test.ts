import * as userRepository from '../../src/repository/user-repository';
import * as ideaCommentRepository from '../../src/repository/idea-comment-repository';
import * as ideaRepository from '../../src/repository/idea-repository';
import {
  createIdeaComment,
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

describe('Create Idea Comment', () => {
  test('Happy Path', async () => {
    mockUserExists.mockResolvedValue(true);
    mockIdeaExists.mockResolvedValue(true);

    const expected = randomIdeaComment();

    expect(
      await createIdeaComment(expected.ideaId, expected.userId, expected.text),
    ).toEqual(
      expect.objectContaining({
        ideaId: expected.ideaId,
        userId: expected.userId,
        text: expected.text,
      }),
    );

    expect(mockPutIdeaComment).toHaveBeenCalledWith(
      expect.objectContaining({
        ideaId: expected.ideaId,
        userId: expected.userId,
        text: expected.text,
      }),
    );
  });

  test('Missing User', async () => {
    mockUserExists.mockResolvedValue(false);

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

    mockGetUser.mockResolvedValue(user);
    mockGetIdeaComment.mockResolvedValue(ideaComment);
    mockGetIdea.mockResolvedValue(idea);

    expect(await getIdeaCommentResponse(ideaComment.id)).toEqual(expected);
  });
});
