import * as hackathonService from '../../../src/service/hackathon-service';
import {remove} from '../../../src/handler/hackathon/remove';
import HackathonDeleteResponse from '../../../src/rest/hackathon/HackathonDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';
import DeletionError from '../../../src/error/DeletionError';

const mockRemoveHackathon = jest
  .spyOn(hackathonService, 'removeHackathon')
  .mockImplementation();

describe('Delete Hackathon', () => {
  test('Happy Path', async () => {
    const id = uuid();
    const event = toEvent(id);
    const callback = jest.fn();

    mockRemoveHackathon.mockResolvedValueOnce(new HackathonDeleteResponse(id));

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

  test('Throws DeletionError', async () => {
    const errorMessage = 'deletion error message';
    const callback = jest.fn();

    mockRemoveHackathon.mockImplementation(() => {
      throw new DeletionError(errorMessage);
    });

    await remove(toEvent(uuid()), null, callback);
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

    mockRemoveHackathon.mockImplementation(() => {
      throw new Error(errorMessage);
    });

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
