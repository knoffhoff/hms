import {randomIdea} from '../../repository/domain/idea-maker';
import {list} from '../../../src/handler/idea/list';
import Uuid, {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';
import IdeaListResponse from '../../../src/rest/IdeaListResponse';
import * as ideaService from '../../../src/service/idea-service';

const mockGetIdeaListResponse = jest.fn();
jest.spyOn(ideaService, 'getIdeaListResponse')
    .mockImplementation(mockGetIdeaListResponse);

describe('List Ideas', () => {
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

    mockGetIdeaListResponse.mockResolvedValue(expected);
    const callback = jest.fn();

    await list(toEvent(hackathonId), null, callback);

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

    await list(toEvent(uuid()), null, callback);
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

    await list(toEvent(uuid()), null, callback);
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

const toEvent = (id: Uuid): any => ({
  pathParameters: {
    hackathonId: id,
  },
});

