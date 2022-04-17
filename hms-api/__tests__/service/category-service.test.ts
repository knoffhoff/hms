import {mockUuid} from '../util/uuids-mock';
import {randomCategory} from '../repository/domain/category-maker';
import {
  createCategory,
  removeCategory,
} from '../../src/service/category-service';
import {uuid} from '../../src/util/Uuid';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';

import * as categoryRepository from '../../src/repository/category-repository';
import * as hackathonRepository
  from '../../src/repository/hackathon-repository';

const mockHackathonExists = jest.fn();
jest.spyOn(hackathonRepository, 'hackathonExists')
    .mockImplementation(mockHackathonExists);

const mockPutCategory = jest.fn();
jest.spyOn(categoryRepository, 'putCategory')
    .mockImplementation(mockPutCategory);

const mockDeleteCategory = jest.fn();
jest.spyOn(categoryRepository, 'deleteCategory')
    .mockImplementation(mockDeleteCategory);


describe('Create Category', () => {
  test('Missing hackathon', async () => {
    mockHackathonExists.mockResolvedValue(false);

    await expect(createCategory('title', 'description', uuid()))
        .rejects
        .toThrow(ReferenceNotFoundError);

    expect(mockPutCategory).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockHackathonExists.mockResolvedValue(true);

    const expected = randomCategory();
    mockUuid(expected.id);

    expect(await createCategory(
        expected.title,
        expected.description,
        expected.hackathonId,
    )).toStrictEqual(expected);

    expect(mockPutCategory).toHaveBeenCalledWith(expected);
  });
});

describe('Delete Category', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeCategory(id);
    expect(mockDeleteCategory).toHaveBeenCalledWith(id);
  });
});
