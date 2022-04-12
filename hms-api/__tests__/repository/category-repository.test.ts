import {mockGetItem, mockQuery} from './dynamo-db-mock';
import {
  getCategory,
  listCategories,
} from '../../src/repository/category-repository';
import {uuid} from '../../src/util/uuids';
import NotFoundError from '../../src/repository/error/NotFoundError';
import {
  CategoryData,
  makeCategory,
  randomCategory,
} from './domain/category-maker';
import Category from '../../src/repository/domain/Category';
import {AttributeValue} from '@aws-sdk/client-dynamodb';

describe('Get Category', () => {
  test('Category doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getCategory(id)).rejects.toThrow(NotFoundError);
  });

  test('Category exists', async () => {
    const expected = randomCategory();
    mockGetItem(itemFromCategory(expected));

    expect(await getCategory(expected.id)).toStrictEqual(expected);
  });
});

describe('List Categories', () => {
  test('Query returns null', async () => {
    const hackathonId = uuid();
    mockQuery(null);

    await expect(listCategories(hackathonId))
        .rejects
        .toThrow(NotFoundError);
  });

  test('0 Categories exist', async () => {
    const hackathonId = uuid();
    mockQuery([]);

    expect(await listCategories(hackathonId)).toStrictEqual([]);
  });

  test('1 Category exists', async () => {
    const hackathonId = uuid();
    const category = makeCategory({hackathonId: hackathonId} as CategoryData);
    mockQuery([itemFromCategory(category)]);

    expect(await listCategories(hackathonId)).toStrictEqual([category]);
  });

  test('2 Categories exist', async () => {
    const hackathonId = uuid();
    const category1 = makeCategory({hackathonId: hackathonId} as CategoryData);
    const category2 = makeCategory({hackathonId: hackathonId} as CategoryData);
    mockQuery([itemFromCategory(category1), itemFromCategory(category2)]);

    expect(await listCategories(hackathonId))
        .toStrictEqual([category1, category2]);
  });
});

const itemFromCategory = (category: Category)
    : { [key: string]: AttributeValue } => ({
  title: {S: category.title},
  description: {S: category.description},
  hackathonId: {S: category.hackathonId},
  id: {S: category.id},
});
