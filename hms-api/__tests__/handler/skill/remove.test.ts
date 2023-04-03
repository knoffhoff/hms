import * as skillService from '../../../src/service/skill-service';
import {remove} from '../../../src/handler/skill/remove';
import SkillDeleteResponse from '../../../src/rest/skill/SkillDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';
import NotFoundError from '../../../src/error/NotFoundError';

const mockRemoveSkill = jest
  .spyOn(skillService, 'removeSkill')
  .mockImplementation();

describe('Delete Skill', () => {
  test('Happy Path', async () => {
    const id = uuid();
    const event = toEvent(id);
    const callback = jest.fn();

    mockRemoveSkill.mockResolvedValueOnce(new SkillDeleteResponse(id));

    await remove(event, null, callback);

    expect(mockRemoveSkill).toHaveBeenCalledWith(id);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new SkillDeleteResponse(id)),
    });
  });

  test('Throws NotFoundError', async () => {
    const errorMessage = 'Not Found';
    const callback = jest.fn();

    mockRemoveSkill.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await remove(toEvent(uuid()), null, callback);

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

    mockRemoveSkill.mockImplementation(() => {
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
