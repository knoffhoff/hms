import {
  categoryByHackathonIdIndex,
  categoryTable,
  mockGetItem,
  mockPutItem,
  mockQuery,
  mockSend,
} from './dynamo-db-mock';

import {
  categoryExists,
  deleteCategory,
  getCategory,
  listCategories,
  putCategory,
} from '../../src/repository/category-repository';
import Uuid, {uuid} from '../../src/util/Uuid';
import NotFoundError from '../../src/error/NotFoundError';
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

    getExpected(id);
  });

  test('Category exists', async () => {
    const expected = randomCategory();
    mockGetItem(itemFromCategory(expected));

    expect(await getCategory(expected.id)).toStrictEqual(expected);
    getExpected(expected.id);
  });
});

describe('Put Category', () => {
  test('Happy Path', async () => {
    mockPutItem();
    const expected = randomCategory();

    await putCategory(expected);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: categoryTable,
            Item: itemFromCategory(expected),
          }),
        }));
  });
});

describe('Delete Category', () => {
  test('Happy Path', async () => {
    const id = uuid();

    await deleteCategory(id);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: categoryTable,
            Key: {id: {S: id}},
          }),
        }),
    );
  });
});

describe('List Categories', () => {
  test('Query returns null', async () => {
    const hackathonId = uuid();
    mockQuery(null);

    await expect(listCategories(hackathonId))
        .rejects
        .toThrow(NotFoundError);

    listExpected(hackathonId);
  });

  test('0 Categories exist', async () => {
    const hackathonId = uuid();
    mockQuery([]);

    expect(await listCategories(hackathonId)).toStrictEqual([]);

    listExpected(hackathonId);
  });

  test('1 Category exists', async () => {
    const hackathonId = uuid();
    const category = makeCategory({hackathonId: hackathonId} as CategoryData);
    mockQuery([itemFromCategory(category)]);

    expect(await listCategories(hackathonId)).toStrictEqual([category]);

    listExpected(hackathonId);
  });

  test('2 Categories exist', async () => {
    const hackathonId = uuid();
    const category1 = makeCategory({hackathonId: hackathonId} as CategoryData);
    const category2 = makeCategory({hackathonId: hackathonId} as CategoryData);
    mockQuery([itemFromCategory(category1), itemFromCategory(category2)]);

    expect(await listCategories(hackathonId))
        .toStrictEqual([category1, category2]);

    listExpected(hackathonId);
  });
});

describe('Category Exists', () => {
  test('Item is non-null', async () => {
    mockGetItem({});

    const id = uuid();
    expect(await categoryExists(id)).toBe(true);

    getExpected(id);
  });

  test('Item is null', async () => {
    mockGetItem(null);

    const id = uuid();
    expect(await categoryExists(id)).toBe(false);

    getExpected(id);
  });
});

const itemFromCategory = (
    category: Category,
): { [key: string]: AttributeValue } => ({
  title: {S: category.title},
  description: {S: category.description},
  hackathonId: {S: category.hackathonId},
  id: {S: category.id},
});

const getExpected = (
    id: Uuid,
) => expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: categoryTable,
        Key: {id: {S: id}},
      }),
    }));

const listExpected = (
    hackathonId: Uuid,
) => expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: categoryTable,
        IndexName: categoryByHackathonIdIndex,
        KeyConditionExpression: 'hackathonId = :hId',
        ExpressionAttributeValues: {':hId': {'S': hackathonId}},
      }),
    }));
