import * as ideaService from '../../../src/service/idea-service';
import {create} from '../../../src/handler/idea/create';
import {randomIdea} from '../../repository/domain/idea-maker';
import {mockUuid} from '../../util/uuids-mock';
import IdeaCreateResponse from '../../../src/rest/IdeaCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import Idea from '../../../src/repository/domain/Idea';

const mockCreateIdea = jest.fn();
jest.spyOn(ideaService, 'createIdea')
    .mockImplementation(mockCreateIdea);

describe('Create Idea', () => {
  test('Happy Path', async () => {
    const expected = randomIdea();
    mockCreateIdea.mockResolvedValue(expected);
    mockUuid(expected.id);
    const callback = jest.fn();

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
    mockCreateIdea.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

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

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockCreateIdea.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

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

const toEvent = (idea: Idea): any => ({
  body: JSON.stringify({
    ownerId: idea.ownerId,
    hackathonId: idea.hackathonId,
    title: idea.title,
    description: idea.description,
    problem: idea.problem,
    goal: idea.goal,
    requiredSkills: idea.requiredSkills,
    categoryId: idea.categoryId,
  }),
});
