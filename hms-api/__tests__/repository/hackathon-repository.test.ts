import {
  hackathonTable,
  mockDeleteItem,
  mockGetItem,
  mockPutItem,
  mockQuery,
  mockSend,
} from './dynamo-db-mock';
import {
  deleteHackathon,
  getHackathon,
  hackathonExists,
  listHackathons,
  putHackathon,
} from '../../src/repository/hackathon-repository';
import Uuid, {uuid} from '../../src/util/Uuid';
import NotFoundError from '../../src/error/NotFoundError';
import {randomHackathon} from './domain/hackathon-maker';
import Hackathon from '../../src/repository/domain/Hackathon';
import {AttributeValue} from '@aws-sdk/client-dynamodb';

describe('Get Hackathon', () => {
  test('Hackathon doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getHackathon(id)).rejects.toThrow(NotFoundError);

    getExpected(id);
  });

  test('Hackathon exists', async () => {
    const expected = randomHackathon();
    mockGetItem(itemFromHackathon(expected));

    expect(await getHackathon(expected.id)).toStrictEqual(expected);

    getExpected(expected.id);
  });
});

describe('Put Hackathon', () => {
  test('Happy Path', async () => {
    mockPutItem();
    const expected = randomHackathon();

    await putHackathon(expected);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: hackathonTable,
            Item: itemFromHackathon(expected),
          }),
        }));
  });
});

describe('Delete Hackathon', () => {
  test('Happy Path', async () => {
    const expected = randomHackathon();
    mockDeleteItem(itemFromHackathon(expected));

    expect(await deleteHackathon(expected.id)).toStrictEqual(expected);
    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: hackathonTable,
            Key: {id: {S: expected.id}},
            ReturnValues: 'ALL_OLD',
          }),
        }),
    );
  });

  test('Hackathon not found', async () => {
    const id = uuid();
    mockDeleteItem(null);

    await expect(deleteHackathon(id))
        .rejects
        .toThrow(NotFoundError);
    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: hackathonTable,
            Key: {id: {S: id}},
            ReturnValues: 'ALL_OLD',
          }),
        }),
    );
  });
});

describe('List Hackathons', () => {
  test('Query returns null', async () => {
    mockQuery(null);

    await expect(listHackathons()).rejects.toThrow(NotFoundError);

    listExpected();
  });

  test('0 Hackathons exist', async () => {
    mockQuery([]);

    expect(await listHackathons()).toStrictEqual([]);

    listExpected();
  });

  test('1 Hackathon exists', async () => {
    const hackathon = randomHackathon();
    mockQuery([itemFromHackathon(hackathon)]);

    expect(await listHackathons()).toStrictEqual([hackathon]);

    listExpected();
  });

  test('2 Hackathons exist', async () => {
    const hackathon1 = randomHackathon();
    const hackathon2 = randomHackathon();
    mockQuery([
      itemFromHackathon(hackathon1),
      itemFromHackathon(hackathon2),
    ]);

    expect(await listHackathons()).toStrictEqual([hackathon1, hackathon2]);

    listExpected();
  });
});

describe('Hackathon Exists', () => {
  test('Item is non-null', async () => {
    mockGetItem({});

    const id = uuid();
    expect(await hackathonExists(id)).toBe(true);

    getExpected(id);
  });

  test('Item is null', async () => {
    mockGetItem(null);

    const id = uuid();
    expect(await hackathonExists(id)).toBe(false);

    getExpected(id);
  });
});

const itemFromHackathon = (
    hackathon: Hackathon,
): { [key: string]: AttributeValue } => ({
  id: {S: hackathon.id},
  title: {S: hackathon.title},
  startDate: {S: hackathon.startDate.toISOString()},
  endDate: {S: hackathon.endDate.toISOString()},
  creationDate: {S: hackathon.creationDate.toISOString()},
});

const getExpected = (id: Uuid) => expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: hackathonTable,
        Key: {id: {S: id}},
      }),
    }));

const listExpected = () => expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: hackathonTable,
      }),
    }));
