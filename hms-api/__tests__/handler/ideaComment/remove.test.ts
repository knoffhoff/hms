import * as ideaCommentService from '../../../src/service/idea-comment-service';
import {remove} from '../../../src/handler/ideaComment/remove';
import IdeaCommentDeleteResponse from '../../../src/rest/ideaComment/IdeaCommentDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';

const mockRemoveIdeaComment = jest
  .spyOn(ideaCommentService, 'removeIdeaComment')
  .mockImplementation();

describe('Delete Comment', () => {
  test('Happy Path', async () => {
    const id = uuid();
    const event = toEvent(id);
    const callback = jest.fn();

    mockRemoveIdeaComment.mockResolvedValueOnce(
      new IdeaCommentDeleteResponse(id),
    );

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
    const callback = jest.fn();

    mockRemoveIdeaComment.mockImplementation(() => {
      throw new Error(errorMessage);
    });

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
