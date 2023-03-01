import * as ideaCommentServive from '../../../src/service/idea-comment-service';
import {edit} from '../../../src/handler/ideaComment/edit';
import Uuid, {uuid} from '../../../src/util/Uuid';
import ideaCommentEditRequest from '../../../src/rest/ideaComment/IdeaCommentEditRequest';
import ideaCommentEditResponse from '../../../src/rest/ideaComment/IdeaCommentEditResponse';
import NotFoundError from '../../../src/error/NotFoundError';
import ValidationError from '../../../src/error/ValidationError';
import ValidationResult from '../../../src/error/ValidationResult';

const mockEditIdeaComment = jest
  .spyOn(ideaCommentServive, 'editIdeaComment')
  .mockImplementation();

describe('Edit Idea Comment', () => {
  const text = 'New fancy text';
  const id = uuid();

  test('Happy Path', async () => {
    const callback = jest.fn();

    mockEditIdeaComment.mockImplementation();

    await edit(toEvent(id, text), null, callback);

    expect(mockEditIdeaComment).toHaveBeenCalledWith(id, text);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new ideaCommentEditResponse(id)),
    });
  });

  test('Throws NotFoundError', async () => {
    const callback = jest.fn();
    const errorMessage = 'Where is it????';

    mockEditIdeaComment.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await edit(toEvent(id, text), null, callback);

    expect(mockEditIdeaComment).toHaveBeenCalledWith(id, text);
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

  test('Throws ValidationError', async () => {
    const callback = jest.fn();
    const errorMessage = 'Something is wrong';

    mockEditIdeaComment.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult());
    });

    await edit(toEvent(id, text), null, callback);

    expect(mockEditIdeaComment).toHaveBeenCalledWith(id, text);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 422,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({errorMessage: errorMessage}),
    });
  });

  test('Throws Error', async () => {
    const callback = jest.fn();
    const errorMessage = 'Something went wrong';

    mockEditIdeaComment.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await edit(toEvent(id, text), null, callback);

    expect(mockEditIdeaComment).toHaveBeenCalledWith(id, text);
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

const toEvent = (id: Uuid, text: string): object => ({
  body: JSON.stringify(new ideaCommentEditRequest(text)),
  pathParameters: {
    id: id,
  },
});
