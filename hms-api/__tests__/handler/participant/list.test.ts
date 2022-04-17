import {
  makeParticipant,
  ParticipantData,
} from '../../repository/domain/participant-maker';
import {list} from '../../../src/handler/participant/list';
import {randomUser} from '../../repository/domain/user-maker';
import Uuid, {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';
import ParticipantListResponse from '../../../src/rest/ParticipantListResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import * as participantService from '../../../src/service/participant-service';

const mockGetParticipantListResponse = jest.fn();
jest.spyOn(participantService, 'getParticipantListResponse')
    .mockImplementation(mockGetParticipantListResponse);

describe('List Participants', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const user1 = randomUser();
    const participant1 = makeParticipant({userId: user1.id} as ParticipantData);
    const user2 = randomUser();
    const participant2 = makeParticipant({userId: user2.id} as ParticipantData);
    const user3 = randomUser();
    const participant3 = makeParticipant({userId: user3.id} as ParticipantData);
    const expected = ParticipantListResponse.from(
        [participant1, participant2, participant3],
        [user1, user2, user3],
        hackathonId,
    );

    mockGetParticipantListResponse.mockResolvedValue(expected);
    const callback = jest.fn();

    await list(toEvent(hackathonId), null, callback);

    expect(mockGetParticipantListResponse).toHaveBeenCalled();
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
    mockGetParticipantListResponse.mockImplementation(() => {
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

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockGetParticipantListResponse.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await list(toEvent(uuid()), null, callback);
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
    mockGetParticipantListResponse.mockImplementation(() => {
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

