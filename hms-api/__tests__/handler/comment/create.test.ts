import * as commentService from '../../../src/service/idea_comment-service';
import CommentCreateResponse from '../../../src/rest/comment/CommentCreateResponse';
import {create} from '../../../src/handler/comment/create';
import {randomIdeaComment} from '../../repository/domain/ideaComment-maker';
import ideaComment from '../../../src/repository/domain/IdeaComment';
import CommentCreateRequest from '../../../src/rest/comment/CommentCreateRequest';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';

const mockCreateIdeaComment = jest.fn();
jest
  .spyOn(commentService, 'createComment')
  .mockImplementation(mockCreateIdeaComment);

describe('Create Comment', () => {
  test('Happy Path', async () => {
    const expected = randomIdeaComment();
    mockCreateIdeaComment.mockResolvedValue(expected);
    const callback = jest.fn();

    await create(toEvent(expected), null, callback);

    expect(mockCreateIdeaComment).toHaveBeenCalledWith(
      expected.ideaId,
      expected.userId,
      expected.text,
      expected.replyTo,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new CommentCreateResponse(expected.id)),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockCreateIdeaComment.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomIdeaComment()), null, callback);
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
    const errorMessage = 'generic error message';
    mockCreateIdeaComment.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomIdeaComment()), null, callback);
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

const toEvent = (ideaComment: ideaComment): object => ({
  body: JSON.stringify(
    new CommentCreateRequest(
      ideaComment.userId,
      ideaComment.ideaId,
      ideaComment.text,
    ),
  ),
});
