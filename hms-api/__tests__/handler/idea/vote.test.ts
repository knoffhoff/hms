import * as ideaService from '../../../src/service/idea-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {vote} from '../../../src/handler/idea/vote';
import IdeaVoteResponse from '../../../src/rest/idea/IdeaVoteResponse';
import NotFoundError from '../../../src/error/NotFoundError';
import InvalidStateError from '../../../src/error/InvalidStateError';

const mockAddVoter = jest.spyOn(ideaService, 'addVoter').mockImplementation();

describe('Vote for Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const participantId = uuid();
    const event = toEvent(ideaId, participantId);
    const callback = jest.fn();

    await vote(event, null, callback);

    expect(mockAddVoter).toHaveBeenCalledWith(ideaId, participantId);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaVoteResponse(ideaId, participantId)),
    });
  });

  test('Throws NotFoundError', async () => {
    const errorMessage = 'reference error message';
    const callback = jest.fn();

    mockAddVoter.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await vote(toEvent(uuid(), uuid()), null, callback);

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

  test('Throws InvalidStateError', async () => {
    const errorMessage = 'invalid state error message';
    const callback = jest.fn();

    mockAddVoter.mockImplementation(() => {
      throw new InvalidStateError(errorMessage);
    });

    await vote(toEvent(uuid(), uuid()), null, callback);

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
    const callback = jest.fn();

    mockAddVoter.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await vote(toEvent(uuid(), uuid()), null, callback);

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

const toEvent = (ideaId: Uuid, participantId: Uuid): any => ({
  pathParameters: {
    id: ideaId,
    participantId: participantId,
  },
});
