import * as participantService from '../../../src/service/participant-service';
import {create} from '../../../src/handler/participant/create';
import {randomParticipant} from '../../repository/domain/participant-maker';
import ParticipantCreateResponse from '../../../src/rest/participant/ParticipantCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import Participant from '../../../src/repository/domain/Participant';
import ParticipantCreateRequest from '../../../src/rest/participant/ParticipantCreateRequest';
import ValidationError from '../../../src/error/ValidationError';
import ValidationResult from '../../../src/error/ValidationResult';

const mockCreateParticipant = jest
  .spyOn(participantService, 'createParticipant')
  .mockImplementation();

describe('Create Participant', () => {
  test('Happy Path', async () => {
    const expected = randomParticipant();
    const callback = jest.fn();

    mockCreateParticipant.mockResolvedValueOnce(expected);

    await create(toEvent(expected), null, callback);

    expect(mockCreateParticipant).toHaveBeenCalledWith(
      expected.userId,
      expected.hackathonId,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new ParticipantCreateResponse(expected.id)),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    const callback = jest.fn();

    mockCreateParticipant.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });

    await create(toEvent(randomParticipant()), null, callback);

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

    mockCreateParticipant.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult());
    });

    await create(toEvent(randomParticipant()), null, callback);

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

    mockCreateParticipant.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await create(toEvent(randomParticipant()), null, callback);

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

const toEvent = (participant: Participant): object => ({
  body: JSON.stringify(
    new ParticipantCreateRequest(participant.userId, participant.hackathonId),
  ),
});
