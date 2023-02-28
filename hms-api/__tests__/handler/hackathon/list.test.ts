import {randomHackathon} from '../../repository/domain/hackathon-maker';
import {list} from '../../../src/handler/hackathon/list';
import NotFoundError from '../../../src/error/NotFoundError';
import HackathonListResponse from '../../../src/rest/hackathon/HackathonListResponse';
import * as hackathonService from '../../../src/service/hackathon-service';

const mockGetHackathonListResponse = jest
  .spyOn(hackathonService, 'getHackathonListResponse')
  .mockImplementation();

describe('List Hackathons', () => {
  test('Happy Path', async () => {
    const hackathon1 = randomHackathon();
    const hackathon2 = randomHackathon();
    const hackathon3 = randomHackathon();
    const hackathon4 = randomHackathon();
    const expected = HackathonListResponse.from([
      hackathon1,
      hackathon2,
      hackathon3,
      hackathon4,
    ]);
    const callback = jest.fn();

    mockGetHackathonListResponse.mockResolvedValueOnce(expected);

    await list({}, null, callback);

    expect(mockGetHackathonListResponse).toHaveBeenCalled();
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

    mockGetHackathonListResponse.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await list({}, null, callback);

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
    const callback = jest.fn();

    mockGetHackathonListResponse.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await list({}, null, callback);

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
