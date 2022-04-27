import {randomCategory} from '../repository/domain/category-maker';
import {randomHackathon} from '../repository/domain/hackathon-maker';
import {
  createCategory,
  getCategoryListResponse,
  getCategoryResponse,
  removeCategory,
} from '../../src/service/category-service';
import {uuid} from '../../src/util/Uuid';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import CategoryResponse from '../../src/rest/CategoryResponse';
import NotFoundError from '../../src/error/NotFoundError';
import CategoryListResponse from '../../src/rest/CategoryListResponse';
import * as categoryRepository from '../../src/repository/category-repository';
import * as hackathonRepository
  from '../../src/repository/hackathon-repository';

const mockHackathonExists = jest.fn();
jest.spyOn(hackathonRepository, 'hackathonExists')
    .mockImplementation(mockHackathonExists);
const mockGetHackathon = jest.fn();
jest.spyOn(hackathonRepository, 'getHackathon')
    .mockImplementation(mockGetHackathon);

const mockPutCategory = jest.fn();
jest.spyOn(categoryRepository, 'putCategory')
    .mockImplementation(mockPutCategory);
const mockGetCategory = jest.fn();
jest.spyOn(categoryRepository, 'getCategory')
    .mockImplementation(mockGetCategory);
const mockListCategories = jest.fn();
jest.spyOn(categoryRepository, 'listCategories')
    .mockImplementation(mockListCategories);
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
    expect(mockDeleteCategory).not.toHaveBeenCalled();
  });

  test('Happy Path', async () => {
    mockHackathonExists.mockResolvedValue(true);

    const expected = randomCategory();

    expect(await createCategory(
        expected.title,
        expected.description,
        expected.hackathonId,
    )).toEqual(expect.objectContaining({
      title: expected.title,
      description: expected.description,
      hackathonId: expected.hackathonId,
    }));

    expect(mockPutCategory).toHaveBeenCalledWith(expect.objectContaining({
      title: expected.title,
      description: expected.description,
      hackathonId: expected.hackathonId,
    }));
    expect(mockDeleteCategory).not.toHaveBeenCalled();
  });
});

describe('Get Category Response', () => {
  test('Happy Path', async () => {
    const category = randomCategory();
    const hackathon = randomHackathon();
    const expected = CategoryResponse.from(category, hackathon);

    mockGetCategory.mockResolvedValue(category);
    mockGetHackathon.mockResolvedValue(hackathon);

    expect(await getCategoryResponse(category.id)).toStrictEqual(expected);
    expect(mockGetCategory).toHaveBeenCalledWith(category.id);
    expect(mockGetHackathon).toHaveBeenCalledWith(category.hackathonId);
  });

  test('Missing Category', async () => {
    const category = randomCategory();
    mockGetCategory.mockImplementation(() => {
      throw new NotFoundError('Thing is missing');
    });

    await expect(getCategoryResponse(category.id))
        .rejects
        .toThrow(NotFoundError);
    expect(mockGetCategory).toHaveBeenCalledWith(category.id);
    expect(mockGetHackathon).not.toHaveBeenCalled();
  });

  test('Missing Hackathon', async () => {
    const category = randomCategory();
    mockGetCategory.mockResolvedValue(category);
    mockGetHackathon.mockImplementation(() => {
      throw new NotFoundError('Thing is missing');
    });

    await expect(getCategoryResponse(category.id))
        .rejects
        .toThrow(ReferenceNotFoundError);
    expect(mockGetCategory).toHaveBeenCalledWith(category.id);
    expect(mockGetHackathon).toHaveBeenCalledWith(category.hackathonId);
  });
});

describe('Get Category List Response', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const category1 = randomCategory();
    const category2 = randomCategory();
    const category3 = randomCategory();
    const expected = CategoryListResponse.from(
        [category1, category2, category3],
        hackathonId);

    mockListCategories.mockResolvedValue([category1, category2, category3]);

    expect(await getCategoryListResponse(hackathonId)).toStrictEqual(expected);
    expect(mockListCategories).toHaveBeenCalledWith(hackathonId);
  });
});

describe('Delete Category', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeCategory(id);
    expect(mockDeleteCategory).toHaveBeenCalledWith(id);
  });
});
