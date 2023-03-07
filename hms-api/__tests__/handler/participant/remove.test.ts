import * as participantService from '../../../src/service/participant-service';
import {remove} from '../../../src/handler/participant/remove';
import ParticipantDeleteResponse from '../../../src/rest/participant/ParticipantDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';
import UserDeleteResponse from '../../../src/rest/user/UserDeleteResponse';

const mockRemoveParticipant = jest
  .spyOn(participantService, 'removeParticipant')
  .mockImplementation();

describe('Delete Participant', () => {
  test('Happy Path', async () => {
    const id = uuid();
    mockRemoveParticipant.mockResolvedValueOnce(new UserDeleteResponse(id));
    const event = toEvent(id);
    const callback = jest.fn();

    await remove(event, null, callback);

    expect(mockRemoveParticipant).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new ParticipantDeleteResponse(id)),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockRemoveParticipant.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await remove(toEvent(uuid()), null, callback);
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
