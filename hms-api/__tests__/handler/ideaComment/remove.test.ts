import * as ideaCommentService from '../../../src/service/idea-comment-service';
import {remove} from '../../../src/handler/ideaComment/remove';
import IdeaCommentDeleteResponse from '../../../src/rest/ideaComment/IdeaCommentDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';

const mockRemoveIdeaComment = jest.fn();
jest
  .spyOn(ideaCommentService, 'removeIdeaComment')
  .mockImplementation(mockRemoveIdeaComment);

describe('Delete Comment', () => {
  test('Happy Path', async () => {
    const id = uuid();
    mockRemoveIdeaComment.mockResolvedValue(new IdeaCommentDeleteResponse(id));
    const event = toEvent(id);
    const callback = jest.fn();

    await remove(event, null, callback);

    expect(mockRemoveIdeaComment).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaCommentDeleteResponse(id)),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockRemoveIdeaComment.mockImplementation(() => {
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
