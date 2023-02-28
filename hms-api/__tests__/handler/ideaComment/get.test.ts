import {randomIdeaComment} from '../../repository/domain/ideaComment-maker';
import {get} from '../../../src/handler/ideaComment/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as ideaCommentService from '../../../src/service/idea-comment-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import IdeaCommentResponse from '../../../src/rest/ideaComment/IdeaCommentResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import {randomUser} from '../../repository/domain/user-maker';

const mockGetIdeaComment = jest
  .spyOn(ideaCommentService, 'getIdeaCommentResponse')
  .mockImplementation();

describe('Get Comment', () => {
  test('Happy Path', async () => {
    const ideaComment = randomIdeaComment();
    const expected = IdeaCommentResponse.from(ideaComment, randomUser());

    mockGetIdeaComment.mockResolvedValueOnce(expected);
    const event = toEvent(ideaComment.id);
    const callback = jest.fn();

    await get(event, null, callback);

    expect(mockGetIdeaComment).toHaveBeenCalledWith(ideaComment.id);
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
    mockGetIdeaComment.mockImplementation(() => {
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
    mockGetIdeaComment.mockImplementation(() => {
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
    mockGetIdeaComment.mockImplementation(() => {
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
