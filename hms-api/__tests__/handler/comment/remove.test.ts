import * as commentService from '../../../src/service/idea_comment-service';
import {remove} from '../../../src/handler/comment/remove';
import CommentDeleteResponse from '../../../src/rest/comment/CommentDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';

const mockRemoveComment = jest.fn();
jest
  .spyOn(commentService, 'removeComment')
  .mockImplementation(mockRemoveComment);

describe('Delete Comment', () => {
  test('Happy Path', async () => {
    const id = uuid();
    mockRemoveComment.mockResolvedValue(new CommentDeleteResponse(id));
    const event = toEvent(id);
    const callback = jest.fn();

    await remove(event, null, callback);

    expect(mockRemoveComment).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new CommentDeleteResponse(id)),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockRemoveComment.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await remove(toEvent(uuid()), null, callback);
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
