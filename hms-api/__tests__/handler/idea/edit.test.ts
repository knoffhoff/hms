import {edit} from '../../../src/handler/idea/edit';
import Uuid, {uuid} from '../../../src/util/Uuid';
import * as ideaService from '../../../src/service/idea-service';
import IdeaEditResponse from '../../../src/rest/idea/IdeaEditResponse';
import NotFoundError from '../../../src/error/NotFoundError';
import IdeaEditRequest from '../../../src/rest/idea/IdeaEditRequest';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';

const mockEditIdea = jest.fn();
jest.spyOn(ideaService, 'editIdea').mockImplementation(mockEditIdea);

describe('Edit Idea', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const title = 'New fancy title';
    const description = 'Well this is awkward';
    const problem = '1 + 1 = X';
    const goal = 'What does Y equal?';
    const requiredSkills = [uuid(), uuid()];
    const categoryId = uuid();
    const id = uuid();
    const callback = jest.fn();

    mockEditIdea.mockImplementation(() => {});

    await edit(
      toEvent(
        hackathonId,
        title,
        description,
        problem,
        goal,
        requiredSkills,
        categoryId,
        id,
      ),
      null,
      callback,
    );

    expect(mockEditIdea).toHaveBeenCalledWith(
      id,
      hackathonId,
      title,
      description,
      problem,
      goal,
      requiredSkills,
      categoryId,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaEditResponse(id)),
    });
  });

  test('Throws NotFoundError', async () => {
    const hackathonId = uuid();
    const title = 'New fancy title';
    const description = 'Well this is awkward';
    const problem = '1 + 1 = X';
    const goal = 'What does Y equal?';
    const requiredSkills = [uuid(), uuid()];
    const categoryId = uuid();
    const id = uuid();
    const callback = jest.fn();

    const errorMessage = 'Where is it????';
    mockEditIdea.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await edit(
      toEvent(
        hackathonId,
        title,
        description,
        problem,
        goal,
        requiredSkills,
        categoryId,
        id,
      ),
      null,
      callback,
    );

    expect(mockEditIdea).toHaveBeenCalledWith(
      id,
      hackathonId,
      title,
      description,
      problem,
      goal,
      requiredSkills,
      categoryId,
    );
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
    const hackathonId = uuid();
    const title = 'New fancy title';
    const description = 'Well this is awkward';
    const problem = '1 + 1 = X';
    const goal = 'What does Y equal?';
    const requiredSkills = [uuid(), uuid()];
    const categoryId = uuid();
    const id = uuid();
    const callback = jest.fn();

    const errorMessage = 'Where is it????';
    mockEditIdea.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });

    await edit(
      toEvent(
        hackathonId,
        title,
        description,
        problem,
        goal,
        requiredSkills,
        categoryId,
        id,
      ),
      null,
      callback,
    );

    expect(mockEditIdea).toHaveBeenCalledWith(
      id,
      hackathonId,
      title,
      description,
      problem,
      goal,
      requiredSkills,
      categoryId,
    );
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
    const hackathonId = uuid();
    const title = 'New fancy title';
    const description = 'Well this is awkward';
    const problem = '1 + 1 = X';
    const goal = 'What does Y equal?';
    const requiredSkills = [uuid(), uuid()];
    const categoryId = uuid();
    const id = uuid();
    const callback = jest.fn();

    const errorMessage = 'Boring old error';
    mockEditIdea.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await edit(
      toEvent(
        hackathonId,
        title,
        description,
        problem,
        goal,
        requiredSkills,
        categoryId,
        id,
      ),
      null,
      callback,
    );

    expect(mockEditIdea).toHaveBeenCalledWith(
      id,
      hackathonId,
      title,
      description,
      problem,
      goal,
      requiredSkills,
      categoryId,
    );
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

const toEvent = (
  hackathonId: Uuid,
  title: string,
  description: string,
  problem: string,
  goal: string,
  requiredSkills: Uuid[],
  categoryId: Uuid,
  id: Uuid,
): object => ({
  body: JSON.stringify(
    new IdeaEditRequest(
      hackathonId,
      title,
      description,
      problem,
      goal,
      requiredSkills,
      categoryId,
    ),
  ),
  pathParameters: {
    id: id,
  },
});
