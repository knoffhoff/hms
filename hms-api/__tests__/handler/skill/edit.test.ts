import {edit} from '../../../src/handler/skill/edit';
import Uuid, {uuid} from '../../../src/util/Uuid';
import SkillEditResponse from '../../../src/rest/SkillEditResponse';
import NotFoundError from '../../../src/error/NotFoundError';
import SkillEditRequest from '../../../src/rest/SkillEditRequest';
import * as skillService from '../../../src/service/skill-service';

const mockEditSkill = jest.fn();
jest.spyOn(skillService, 'editSkill')
    .mockImplementation(mockEditSkill);

describe('Edit Skill', () => {
  test('Happy Path', async () => {
    const title = 'New fancy title';
    const description = 'Well this is awkward';
    const id = uuid();
    const callback = jest.fn();

    mockEditSkill.mockImplementation(() => {
    });

    await edit(toEvent(title, description, id), null, callback);

    expect(mockEditSkill)
        .toHaveBeenCalledWith(id, title, description);
    expect(callback)
        .toHaveBeenCalledWith(null, {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'content-type': 'application/json',
          },
          body: JSON.stringify(new SkillEditResponse(id)),
        });
  });

  test('Throws NotFoundError', async () => {
    const title = 'New fancy title';
    const description = 'Well this is awkward';
    const id = uuid();
    const callback = jest.fn();

    const errorMessage = 'Where is it????';
    mockEditSkill.mockImplementation(() => {
      throw new NotFoundError(errorMessage);
    });

    await edit(toEvent(title, description, id), null, callback);

    expect(mockEditSkill)
        .toHaveBeenCalledWith(id, title, description);
    expect(callback)
        .toHaveBeenCalledWith(null, {
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
    const title = 'New fancy title';
    const description = 'Well this is awkward';
    const id = uuid();
    const callback = jest.fn();

    const errorMessage = 'Boring old error';
    mockEditSkill.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    await edit(toEvent(title, description, id), null, callback);

    expect(mockEditSkill)
        .toHaveBeenCalledWith(id, title, description);
    expect(callback)
        .toHaveBeenCalledWith(null, {
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

const toEvent = (
    title: string,
    description: string,
    id: Uuid,
): object => ({
  body: JSON.stringify(new SkillEditRequest(title, description)),
  pathParameters: {
    id: id,
  },
});
