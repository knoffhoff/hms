import {
  makeIdeaComment,
  IdeaCommentData,
} from '../../repository/domain/ideaComment-maker';
import {list} from '../../../src/handler/ideaComment/list';
import {randomUser} from '../../repository/domain/user-maker';
import Uuid, {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';
import IdeaCommentListResponse from '../../../src/rest/ideaComment/IdeaCommentListResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import * as ideaCommentService from '../../../src/service/idea-comment-service';

const mockGetIdeaCommentListResponse = jest.fn();
jest
  .spyOn(ideaCommentService, 'getIdeaCommentListResponse')
  .mockImplementation(mockGetIdeaCommentListResponse);

describe('List Comments', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const user1 = randomUser();
    const ideaComment1 = makeIdeaComment({
      userId: user1.id,
    } as IdeaCommentData);
    const user2 = randomUser();
    const ideaComment2 = makeIdeaComment({
      userId: user2.id,
    } as IdeaCommentData);
    const user3 = randomUser();
    const ideaComment3 = makeIdeaComment({
      userId: user3.id,
    } as IdeaCommentData);
    const expected = IdeaCommentListResponse.from(
      [ideaComment1, ideaComment2, ideaComment3],
      [user1, user2, user3],
      ideaId,
    );

    mockGetIdeaCommentListResponse.mockResolvedValueOnce(expected);
    const callback = jest.fn();

    await list(toEvent(ideaId), null, callback);

    expect(mockGetIdeaCommentListResponse).toHaveBeenCalled();
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
    mockGetIdeaCommentListResponse.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await list(toEvent(uuid()), null, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        errorMessage: errorMessage,
      }),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockGetIdeaCommentListResponse.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await list(toEvent(uuid()), null, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        errorMessage: errorMessage,
      }),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'error message';
    mockGetIdeaCommentListResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await list(toEvent(uuid()), null, callback);

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        errorMessage: errorMessage,
      }),
    });
  });
});

const toEvent = (id: Uuid): any => ({
  pathParameters: {
    id: id,
  },
});
