import {
  CategoryData,
  makeCategory,
  randomCategory,
} from '../repository/domain/category-maker';
import {randomHackathon} from '../repository/domain/hackathon-maker';
import {
  createCategory,
  editCategory,
  getCategoryListResponse,
  getCategoryResponse,
  removeCategoriesForHackathon,
  removeCategory,
} from '../../src/service/category-service';
import {uuid} from '../../src/util/Uuid';
import ReferenceNotFoundError from '../../src/error/ReferenceNotFoundError';
import CategoryResponse from '../../src/rest/category/CategoryResponse';
import NotFoundError from '../../src/error/NotFoundError';
import CategoryListResponse from '../../src/rest/category/CategoryListResponse';
import Category from '../../src/repository/domain/Category';
import DeletionError from '../../src/error/DeletionError';
import CategoryDeleteResponse from '../../src/rest/category/CategoryDeleteResponse';
import * as categoryRepository from '../../src/repository/category-repository';
import * as hackathonRepository from '../../src/repository/hackathon-repository';
import * as ideaService from '../../src/service/idea-service';
import ValidationError from '../../src/error/ValidationError';
import ValidationResult from '../../src/error/ValidationResult';

const mockHackathonExists = jest.fn();
jest
  .spyOn(hackathonRepository, 'hackathonExists')
  .mockImplementation(mockHackathonExists);
const mockGetHackathon = jest.fn();
jest
  .spyOn(hackathonRepository, 'getHackathon')
  .mockImplementation(mockGetHackathon);

const mockPutCategory = jest.fn();
jest
  .spyOn(categoryRepository, 'putCategory')
  .mockImplementation(mockPutCategory);
const mockGetCategory = jest.fn();
jest
  .spyOn(categoryRepository, 'getCategory')
  .mockImplementation(mockGetCategory);
const mockListCategories = jest.fn();
jest
  .spyOn(categoryRepository, 'listCategories')
  .mockImplementation(mockListCategories);
const mockDeleteCategory = jest.fn();
jest
  .spyOn(categoryRepository, 'deleteCategory')
  .mockImplementation(mockDeleteCategory);

const mockRemoveIdeasForCategory = jest.fn();
jest
  .spyOn(ideaService, 'removeIdeasForCategory')
  .mockImplementation(mockRemoveIdeasForCategory);

describe('Create Category', () => {
  test('Happy Path', async () => {
    mockHackathonExists.mockResolvedValueOnce(true);

    const expected = randomCategory();

    expect(
      await createCategory(
        expected.title,
        expected.description,
        expected.hackathonId,
      ),
    ).toEqual(
      expect.objectContaining({
        title: expected.title,
        description: expected.description,
        hackathonId: expected.hackathonId,
      }),
    );

    expect(mockPutCategory).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expected.title,
        description: expected.description,
        hackathonId: expected.hackathonId,
      }),
    );
  });

  test('Validation Error', async () => {
    mockHackathonExists.mockResolvedValueOnce(true);

    await expect(createCategory('', 'descriiiiption', uuid())).rejects.toThrow(
      ValidationError,
    );
  });

  test('Missing hackathon', async () => {
    mockHackathonExists.mockResolvedValueOnce(false);

    await expect(
      createCategory('title', 'description', uuid()),
    ).rejects.toThrow(ReferenceNotFoundError);

    expect(mockPutCategory).not.toHaveBeenCalled();
  });
});

describe('Edit Category', () => {
  test('Happy Path', async () => {
    const oldCategory = randomCategory();
    const title = 'Worst Category Ever';
    const description = 'Best description ever!';
    const expected = new Category(
      title,
      description,
      oldCategory.hackathonId,
      oldCategory.id,
    );

    mockGetCategory.mockResolvedValueOnce(oldCategory);

    await editCategory(oldCategory.id, title, description);

    expect(mockGetCategory).toHaveBeenCalledWith(oldCategory.id);
    expect(mockPutCategory).toHaveBeenCalledWith(expected);
  });

  test('Validation Error', async () => {
    const failedValidation = new ValidationResult();
    failedValidation.addFailure('FAILURE');

    const mockCategory = randomCategory();
    jest.spyOn(mockCategory, 'validate').mockReturnValue(failedValidation);
    mockGetCategory.mockResolvedValueOnce(mockCategory);

    await expect(
      editCategory(uuid(), 'tiiitle', 'descriiiiption'),
    ).rejects.toThrow(ValidationError);
  });

  test('Category is missing', async () => {
    const id = uuid();

    mockGetCategory.mockImplementation(() => {
      throw new Error('Uh oh');
    });

    await expect(
      editCategory(id, 'Anything', 'There once was a man from Nantucket...'),
    ).rejects.toThrow(NotFoundError);
    expect(mockGetCategory).toHaveBeenCalledWith(id);
    expect(mockPutCategory).not.toHaveBeenCalled();
  });
});

describe('Get Category Response', () => {
  test('Happy Path', async () => {
    const category = randomCategory();
    const hackathon = randomHackathon();
    const expected = CategoryResponse.from(category, hackathon);

    mockGetCategory.mockResolvedValueOnce(category);
    mockGetHackathon.mockResolvedValueOnce(hackathon);

    expect(await getCategoryResponse(category.id)).toStrictEqual(expected);
    expect(mockGetCategory).toHaveBeenCalledWith(category.id);
    expect(mockGetHackathon).toHaveBeenCalledWith(category.hackathonId);
  });

  test('Missing Category', async () => {
    const category = randomCategory();
    mockGetCategory.mockImplementation(() => {
      throw new NotFoundError('Thing is missing');
    });

    await expect(getCategoryResponse(category.id)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockGetCategory).toHaveBeenCalledWith(category.id);
    expect(mockGetHackathon).not.toHaveBeenCalled();
  });

  test('Missing Hackathon', async () => {
    const category = randomCategory();
    mockGetCategory.mockResolvedValueOnce(category);
    mockGetHackathon.mockImplementation(() => {
      throw new NotFoundError('Thing is missing');
    });

    await expect(getCategoryResponse(category.id)).rejects.toThrow(
      ReferenceNotFoundError,
    );
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
      hackathonId,
    );

    mockHackathonExists.mockResolvedValueOnce(true);
    mockListCategories.mockResolvedValueOnce([category1, category2, category3]);

    expect(await getCategoryListResponse(hackathonId)).toStrictEqual(expected);
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockListCategories).toHaveBeenCalledWith(hackathonId);
  });

  test('Hackathon missing', async () => {
    const hackathonId = uuid();
    mockHackathonExists.mockResolvedValueOnce(false);
    mockListCategories.mockResolvedValueOnce([
      randomCategory(),
      randomCategory(),
      randomCategory(),
    ]);

    await expect(getCategoryListResponse(hackathonId)).rejects.toThrow(
      NotFoundError,
    );
    expect(mockHackathonExists).toHaveBeenCalledWith(hackathonId);
    expect(mockListCategories).not.toHaveBeenCalled();
    mockListCategories.mockReset();
  });
});

describe('Delete Category', () => {
  test('Happy Path', async () => {
    const id = uuid();
    mockRemoveIdeasForCategory.mockImplementation(() => {});

    expect(await removeCategory(id)).toStrictEqual(
      new CategoryDeleteResponse(id),
    );
    expect(mockRemoveIdeasForCategory).toHaveBeenCalledWith(id);
    expect(mockDeleteCategory).toHaveBeenCalledWith(id);
  });

  test('Fails to remove Ideas', async () => {
    const id = uuid();
    mockRemoveIdeasForCategory.mockImplementation(() => {
      throw new DeletionError("It just won't delete bud!");
    });

    await expect(removeCategory(id)).rejects.toThrow(DeletionError);
    expect(mockRemoveIdeasForCategory).toHaveBeenCalledWith(id);
    expect(mockDeleteCategory).not.toHaveBeenCalled();
  });
});

describe('Remove Categories for Hackathon', () => {
  test('Happy Path', async () => {
    const hackathonId = uuid();
    const category1 = makeCategory({hackathonId: hackathonId} as CategoryData);
    const category2 = makeCategory({hackathonId: hackathonId} as CategoryData);

    mockListCategories.mockResolvedValueOnce([category1, category2]);
    mockRemoveIdeasForCategory.mockImplementation(() => {});

    await removeCategoriesForHackathon(hackathonId);

    expect(mockRemoveIdeasForCategory).toHaveBeenCalledWith(category1.id);
    expect(mockRemoveIdeasForCategory).toHaveBeenCalledWith(category2.id);
    expect(mockDeleteCategory).toHaveBeenCalledWith(category1.id);
    expect(mockDeleteCategory).toHaveBeenCalledWith(category2.id);
  });
});
