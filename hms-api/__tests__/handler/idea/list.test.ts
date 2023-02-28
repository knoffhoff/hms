import {randomIdea} from '../../repository/domain/idea-maker';
import {listAllIdeas, listHackathonIdeas} from '../../../src/handler/idea/list';
import Uuid, {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';
import IdeaListResponse from '../../../src/rest/idea/IdeaListResponse';
import * as ideaService from '../../../src/service/idea-service';
import IdeaListAllResponse from '../../../src/rest/idea/IdeaListAllResponse';

const mockGetIdeaListResponse = jest
  .spyOn(ideaService, 'getIdeasForHackathonListResponse')
  .mockImplementation();

const mockGetAllIdeasResponse = jest
  .spyOn(ideaService, 'getAllIdeasResponse')
  .mockImplementation();

describe('List Hackathon Ideas', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    const idea3 = randomIdea();
    const idea4 = randomIdea();
    const expected = IdeaListResponse.from(
      [idea1, idea2, idea3, idea4],
      hackathonId,
    );

    mockGetIdeaListResponse.mockResolvedValueOnce(expected);
    const callback = jest.fn();

    await listHackathonIdeas(toEvent(hackathonId), null, callback);

    expect(mockGetIdeaListResponse).toHaveBeenCalled();
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
    mockGetIdeaListResponse.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await listHackathonIdeas(toEvent(uuid()), null, callback);
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

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockGetIdeaListResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await listHackathonIdeas(toEvent(uuid()), null, callback);
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

describe('List All Ideas', () => {
  test('Happy Path', async () => {
    const idea1 = randomIdea();
    const idea2 = randomIdea();
    const idea3 = randomIdea();
    const idea4 = randomIdea();
    const expected = IdeaListAllResponse.from([idea1, idea2, idea3, idea4]);

    mockGetAllIdeasResponse.mockResolvedValueOnce(expected);
    const callback = jest.fn();

    await listAllIdeas(toEvent(null), null, callback);

    expect(mockGetAllIdeasResponse).toHaveBeenCalled();
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

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockGetAllIdeasResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await listAllIdeas(toEvent(null), null, callback);
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
