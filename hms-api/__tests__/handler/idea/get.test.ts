import {get} from '../../../src/handler/idea/get';
import NotFoundError from '../../../src/error/NotFoundError';
import * as ideaService from '../../../src/service/idea-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {randomIdea} from '../../repository/domain/idea-maker';
import IdeaResponse from '../../../src/rest/IdeaResponse';
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError';
import {randomUser} from '../../repository/domain/user-maker';
import {randomParticipant} from '../../repository/domain/participant-maker';
import ParticipantPreviewResponse
  from '../../../src/rest/ParticipantPreviewResponse';
import UserPreviewResponse from '../../../src/rest/UserPreviewResponse';
import {randomHackathon} from '../../repository/domain/hackathon-maker';
import HackathonPreviewResponse
  from '../../../src/rest/HackathonPreviewResponse';
import CategoryPreviewResponse from '../../../src/rest/CategoryPreviewResponse';
import {randomCategory} from '../../repository/domain/category-maker';
import {randomSkill} from '../../repository/domain/skill-maker';
import SkillPreviewResponse from '../../../src/rest/SkillPreviewResponse';

const mockGetIdea = jest.fn();
jest.spyOn(ideaService, 'getIdeaResponse')
    .mockImplementation((mockGetIdea));

describe('Get Idea', () => {
  test('Happy Path', async () => {
    const idea = randomIdea();
    const ownerParticipant = randomParticipant();
    const ownerUser = randomUser();
    const participant = randomParticipant();
    const user = randomUser();
    const hackathon = randomHackathon();
    const category = randomCategory();
    const skill1 = randomSkill();
    const skill2 = randomSkill();

    const expected = new IdeaResponse(
        idea.id,
        new ParticipantPreviewResponse(
            ownerParticipant.id,
            new UserPreviewResponse(
                ownerUser.id,
                ownerUser.lastName,
                ownerUser.firstName,
                ownerUser.imageUrl,
            ),
        ),
        new HackathonPreviewResponse(hackathon.id, hackathon.title),
        [
          new ParticipantPreviewResponse(
              ownerParticipant.id,
              new UserPreviewResponse(
                  ownerUser.id,
                  ownerUser.lastName,
                  ownerUser.firstName,
                  ownerUser.imageUrl,
              ),
          ),
          new ParticipantPreviewResponse(
              participant.id,
              new UserPreviewResponse(
                  user.id,
                  user.lastName,
                  user.firstName,
                  user.imageUrl,
              ),
          ),
        ],
        idea.title,
        idea.description,
        idea.problem,
        idea.goal,
        [
          new SkillPreviewResponse(skill1.id, skill1.name),
          new SkillPreviewResponse(skill2.id, skill2.name),
        ],
        new CategoryPreviewResponse(category.id, category.title),
        idea.creationDate,
    );

    mockGetIdea.mockResolvedValue(expected);
    const event = toEvent(idea.id);
    const callback = jest.fn();

    await get(event, null, callback);

    expect(mockGetIdea).toHaveBeenCalledWith(idea.id);
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
    mockGetIdea.mockImplementation(() => {
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
    mockGetIdea.mockImplementation(() => {
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
    mockGetIdea.mockImplementation(() => {
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
