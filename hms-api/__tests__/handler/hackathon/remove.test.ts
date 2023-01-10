import * as hackathonService from '../../../src/service/hackathon-service';
import {remove} from '../../../src/handler/hackathon/remove';
import HackathonDeleteResponse from '../../../src/rest/Hackathon/HackathonDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';

const mockRemoveHackathon = jest.fn();
jest
  .spyOn(hackathonService, 'removeHackathon')
  .mockImplementation(mockRemoveHackathon);

describe('Delete Hackathon', () => {
  test('Happy Path', async () => {
    const id = uuid();
    mockRemoveHackathon.mockResolvedValue(new HackathonDeleteResponse(id));
    const event = toEvent(id);
    const callback = jest.fn();

    await remove(event, null, callback);

    expect(mockRemoveHackathon).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new HackathonDeleteResponse(id)),
    });
  });

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockRemoveHackathon.mockImplementation(() => {
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
