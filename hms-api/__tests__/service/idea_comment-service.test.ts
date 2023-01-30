import * as userRepository from '../../src/repository/user-repository';
import * as ideaCommentRepository from '../../src/repository/idea_comment-repository';
import * as ideaRepository from '../../src/repository/idea-repository';
import {
  createComment,
  getCommentResponse,
} from '../../src/service/idea_comment-service';
import {uuid} from '../../src/util/Uuid';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import {randomIdea} from '../repository/domain/idea-maker';
import {
  IdeaCommentData,
  makeIdeaComment,
} from '../repository/domain/ideaComment-maker';
import CommentResponse from '../../src/rest/Comment/CommentResponse';
import {randomUser} from '../repository/domain/user-maker';

const mockPutComment = jest.fn();
jest
  .spyOn(ideaCommentRepository, 'putComment')
  .mockImplementation(mockPutComment);
const mockUserExists = jest.fn();
jest.spyOn(userRepository, 'userExists').mockImplementation(mockUserExists);
const mockIdeaExists = jest.fn();
jest.spyOn(ideaRepository, 'ideaExists').mockImplementation(mockIdeaExists);
const mockGetUser = jest.fn();
jest.spyOn(userRepository, 'getUser').mockImplementation(mockGetUser);
const mockGetIdea = jest.fn();
jest.spyOn(ideaRepository, 'getIdea').mockImplementation(mockGetIdea);
const mockGetComment = jest.fn();
jest
  .spyOn(ideaCommentRepository, 'getComment')
  .mockImplementation(mockGetComment);

describe('Create Idea Comment', () => {
  test('Missing User', async () => {
    mockUserExists.mockResolvedValue(false);

    await expect(
      createComment(uuid(), uuid(), 'comment', uuid()),
    ).rejects.toThrowError(ReferenceNotFoundError);

    expect(mockPutComment).not.toHaveBeenCalled();
  });
});

describe('Get Idea Comment', () => {
  test('Happy Path', async () => {
    const user = randomUser();
    const idea = randomIdea();
    const comment = makeIdeaComment({ideaId: idea.id} as IdeaCommentData);

    const expected = CommentResponse.from(comment, user);

    mockGetUser.mockResolvedValue(user);
    mockGetComment.mockResolvedValue(comment);
    mockGetIdea.mockResolvedValue(idea);

    expect(await getCommentResponse(comment.id)).toEqual(expected);
  });
});
