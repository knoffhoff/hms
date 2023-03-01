import * as ideaService from '../../../src/service/idea-service';
import {create} from '../../../src/handler/idea/create';
import {randomIdea} from '../../repository/domain/idea-maker';
import IdeaCreateResponse from '../../../src/rest/idea/IdeaCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import Idea from '../../../src/repository/domain/Idea';
import IdeaCreateRequest from '../../../src/rest/idea/IdeaCreateRequest';
import ValidationError from '../../../src/error/ValidationError';
import ValidationResult from '../../../src/error/ValidationResult';

const mockCreateIdea = jest
  .spyOn(ideaService, 'createIdea')
  .mockImplementation();

describe('Create Idea', () => {
  test('Happy Path', async () => {
    const expected = randomIdea();
    const callback = jest.fn();

    mockCreateIdea.mockResolvedValueOnce(expected);

    await create(toEvent(expected), null, callback);

    expect(mockCreateIdea).toHaveBeenCalledWith(
      expected.ownerId,
      expected.hackathonId,
      expected.title,
      expected.description,
      expected.problem,
      expected.goal,
      expected.requiredSkills,
      expected.categoryId,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaCreateResponse(expected.id)),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    const callback = jest.fn();

    mockCreateIdea.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });

    await create(toEvent(randomIdea()), null, callback);

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

  test('Throws ValidationError', async () => {
    const errorMessage = 'validation error message';
    const callback = jest.fn();

    mockCreateIdea.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult());
    });

    await create(toEvent(randomIdea()), null, callback);
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
    const errorMessage = 'generic error message';
    const callback = jest.fn();

    mockCreateIdea.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await create(toEvent(randomIdea()), null, callback);

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

const toEvent = (idea: Idea): object => ({
  body: JSON.stringify(
    new IdeaCreateRequest(
      idea.ownerId,
      idea.hackathonId,
      idea.title,
      idea.description,
      idea.problem,
      idea.goal,
      idea.requiredSkills,
      idea.categoryId,
    ),
  ),
});
