import * as hackathonService from '../../../src/service/hackathon-service';
import {create} from '../../../src/handler/hackathon/create';
import {randomHackathon} from '../../repository/domain/hackathon-maker';
import HackathonCreateResponse from '../../../src/rest/HackathonCreateResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import Hackathon from '../../../src/repository/domain/Hackathon';

const mockCreateHackathon = jest.fn();
jest.spyOn(hackathonService, 'createHackathon')
    .mockImplementation(mockCreateHackathon);

describe('Create Hackathon', () => {
  test('Happy Path', async () => {
    const expected = randomHackathon();
    mockCreateHackathon.mockResolvedValue(expected);
    const callback = jest.fn();

    await create(toEvent(expected), null, callback);

    expect(mockCreateHackathon).toHaveBeenCalledWith(
        expected.title,
        expected.startDate,
        expected.endDate,
    );
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new HackathonCreateResponse(expected.id)),
    });
  });

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message';
    mockCreateHackathon.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomHackathon()), null, callback);
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
    mockCreateHackathon.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

    await create(toEvent(randomHackathon()), null, callback);
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

const toEvent = (hackathon: Hackathon): any => ({
  body: JSON.stringify({
    title: hackathon.title,
    startDate: hackathon.startDate.toISOString(),
    endDate: hackathon.endDate.toISOString(),
  }),
});
