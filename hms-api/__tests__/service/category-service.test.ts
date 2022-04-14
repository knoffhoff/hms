import {mockPut, mockSend} from '../repository/dynamo-db-mock';
import {mockUuid} from '../util/uuids-mock';
import {randomCategory} from '../repository/domain/category-maker';

import {createCategory} from '../../src/service/category-service';
import {uuid} from '../../src/util/uuids';
import ReferenceNotFoundError
  from '../../src/repository/error/ReferenceNotFoundError';

import * as hackathonRepository
  from '../../src/repository/hackathon-repository';

const mockHackathonExists = jest.fn();
jest.spyOn(hackathonRepository, 'hackathonExists')
    .mockImplementation(mockHackathonExists);

describe('Create Category', () => {
  test('Missing hackathon', async () => {
    mockHackathonExists.mockResolvedValue(false);

    await expect(createCategory('title', 'description', uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockSend).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockPut();

    mockHackathonExists.mockResolvedValue(true);

    const expected = randomCategory();
    mockUuid(expected.id);

    expect(await createCategory(
        expected.title,
        expected.description,
        expected.hackathonId,
    )).toStrictEqual(expected);
  });
});
