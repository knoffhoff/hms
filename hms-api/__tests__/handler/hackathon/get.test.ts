import {get} from '../../../src/handler/hackathon/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as hackathonService from '../../../src/service/hackathon-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {randomHackathon} from '../../repository/domain/hackathon-maker';
import HackathonResponse from '../../../src/rest/HackathonResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import {randomParticipant} from '../../repository/domain/participant-maker';
import ParticipantPreviewResponse
  from '../../../src/rest/ParticipantPreviewResponse';
import {randomUser} from '../../repository/domain/user-maker';
import UserPreviewResponse from '../../../src/rest/UserPreviewResponse';
import {randomCategory} from '../../repository/domain/category-maker';
import {randomIdea} from '../../repository/domain/idea-maker';
import CategoryPreviewResponse from '../../../src/rest/CategoryPreviewResponse';
import IdeaPreviewResponse from '../../../src/rest/IdeaPreviewResponse';

const mockGetHackathon = jest.fn();
jest.spyOn(hackathonService, 'getHackathonResponse')
    .mockImplementation((mockGetHackathon));

describe('Get Hackathon', () => {
  test('Happy Path', async () => {
    const hackathon = randomHackathon();
    const participant1 = randomParticipant();
    const user1 = randomUser();
    const participant2 = randomHackathon();
    const user2 = randomUser();
    const category = randomCategory();
    const idea1 = randomIdea();
    const idea2 = randomIdea();

    const expected = new HackathonResponse(
        hackathon.id,
        hackathon.title,
        hackathon.startDate,
        hackathon.endDate,
        [
          new ParticipantPreviewResponse(
              participant1.id,
              new UserPreviewResponse(
                  user1.id,
                  user1.lastName,
                  user1.firstName,
                  user1.imageUrl,
              ),
          ),
          new ParticipantPreviewResponse(
              participant2.id,
              new UserPreviewResponse(
                  user2.id,
                  user2.lastName,
                  user2.firstName,
                  user2.imageUrl,
              ),
          ),
        ],
        [new CategoryPreviewResponse(category.id, category.title)],
        [
          new IdeaPreviewResponse(idea1.id, idea1.title),
          new IdeaPreviewResponse(idea2.id, idea2.title),
        ],
    );

    mockGetHackathon.mockResolvedValue(expected);
    const event = toEvent(hackathon.id);
    const callback = jest.fn();

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
    mockGetHackathon.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });
    const callback = jest.fn();

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
    mockGetHackathon.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage);
    });
    const callback = jest.fn();

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
    mockGetHackathon.mockImplementation(() => {
      throw new Error(errorMessage);
    });
    const callback = jest.fn();

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

const toEvent = (id: Uuid): any => ({
  pathParameters: {
    id: id,
  },
});
