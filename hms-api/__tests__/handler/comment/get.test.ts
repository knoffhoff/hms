import {randomIdeaComment} from '../../repository/domain/ideaComment-maker';
import {get} from '../../../src/handler/comment/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as commentService from '../../../src/service/idea_comment-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import CommentResponse from '../../../src/rest/comment/CommentResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import {randomUser} from '../../repository/domain/user-maker';

const mockGetComment = jest.fn();
jest
  .spyOn(commentService, 'getCommentResponse')
  .mockImplementation(mockGetComment);

describe('Get Comment', () => {
  test('Happy Path', async () => {
    const comment = randomIdeaComment();
    const expected = CommentResponse.from(comment, randomUser());

    mockGetComment.mockResolvedValue(expected);
    const event = toEvent(comment.id);
    const callback = jest.fn();

    await get(event, null, callback);

    expect(mockGetComment).toHaveBeenCalledWith(comment.id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(expected),
    });
  });

  test('Throws NotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockGetComment.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await get(toEvent(uuid()), null, callback);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockGetComment.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await get(toEvent(uuid()), null, callback);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'error message';
    mockGetComment.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await get(toEvent(uuid()), null, callback);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });
});

const toEvent = (id: Uuid): object => ({
  pathParameters: {
    id: id,
  },
});
