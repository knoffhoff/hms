import * as ideaCommentService from '../../../src/service/idea-comment-service';
import ideaCommentCreateResponse from '../../../src/rest/ideaComment/IdeaCommentCreateResponse';
import {create} from '../../../src/handler/ideaComment/create';
import {randomIdeaComment} from '../../repository/domain/ideaComment-maker';
import ideaComment from '../../../src/repository/domain/IdeaComment';
import IdeaCommentCreateRequest from '../../../src/rest/ideaComment/IdeaCommentCreateRequest';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';

const mockCreateIdeaComment = jest.fn();
jest
  .spyOn(ideaCommentService, 'createIdeaComment')
  .mockImplementation(mockCreateIdeaComment);

describe('Create Comment', () => {
  // test('Happy Path', async () => {
  //   const expected = randomIdeaComment();
  //   mockCreateIdeaComment.mockResolvedValueOnce(expected);
  //   const callback = jest.fn();
  //
  //   await create(toEvent(expected), null, callback);
  //
  //   expect(mockCreateIdeaComment).toHaveBeenCalledWith(
  //     expected.userId,
  //     expected.ideaId,
  //     expected.text,
  //     expected.parentIdeaCommentId,
  //   );
  //   expect(callback).toHaveBeenCalledWith(null, {
  //     statusCode: 201,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Credentials': true,
  //       'content-type': 'application/json',
  //     },
  //     body: JSON.stringify(new ideaCommentCreateResponse(expected.id)),
  //   });
  // });

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
  pathParameters: {
    id: ideaComment.id,
  },
  body: JSON.stringify(
    new IdeaCommentCreateRequest(
      ideaComment.userId,
      ideaComment.ideaId,
      ideaComment.text,
    ),
  ),
});
