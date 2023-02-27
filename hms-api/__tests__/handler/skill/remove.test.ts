import * as skillService from '../../../src/service/skill-service';
import {remove} from '../../../src/handler/skill/remove';
import SkillDeleteResponse from '../../../src/rest/skill/SkillDeleteResponse';
import Uuid, {uuid} from '../../../src/util/Uuid';

const mockRemoveSkill = jest.fn();
jest.spyOn(skillService, 'removeSkill').mockImplementation(mockRemoveSkill);

describe('Delete Skill', () => {
  test('Happy Path', async () => {
    const id = uuid();
    mockRemoveSkill.mockResolvedValueOnce(new SkillDeleteResponse(id));
    const event = toEvent(id);
    const callback = jest.fn();

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

  test('Throws Error', async () => {
    const errorMessage = 'generic error message';
    mockRemoveSkill.mockImplementation(() => {
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
