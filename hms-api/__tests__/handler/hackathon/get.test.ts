import {get} from '../../../src/handler/hackathon/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as hackathonService from '../../../src/service/hackathon-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {randomHackathon} from '../../repository/domain/hackathon-maker';
import HackathonResponse from '../../../src/rest/hackathon/HackathonResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import {
  makeParticipant,
  ParticipantData,
} from '../../repository/domain/participant-maker';
import {randomUser} from '../../repository/domain/user-maker';
import {randomCategory} from '../../repository/domain/category-maker';
import {randomIdea} from '../../repository/domain/idea-maker';

const mockGetHackathon = jest
  .spyOn(hackathonService, 'getHackathonResponse')
  .mockImplementation();

describe('Get Hackathon', () => {
  test('Happy Path', async () => {
    const hackathon = randomHackathon();
    const user1 = randomUser();
    const participant1 = makeParticipant({userId: user1.id} as ParticipantData);
    const user2 = randomUser();
    const participant2 = makeParticipant({userId: user2.id} as ParticipantData);
    const expected = HackathonResponse.from(
      hackathon,
      [participant1, participant2],
      [user1, user2],
      [randomCategory()],
      [randomIdea(), randomIdea()],
    );
    const event = toEvent(hackathon.id);
    const callback = jest.fn();

    mockGetHackathon.mockResolvedValueOnce(expected);

    await get(event, null, callback);

    expect(mockGetHackathon).toHaveBeenCalledWith(hackathon.id);
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
    const callback = jest.fn();

    mockGetHackathon.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await get(toEvent(uuid()), null, callback);

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
    const errorMessage = 'reference error message';
    const callback = jest.fn();

    mockGetHackathon.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });

    await get(toEvent(uuid()), null, callback);

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

    mockGetHackathon.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await get(toEvent(uuid()), null, callback);

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
