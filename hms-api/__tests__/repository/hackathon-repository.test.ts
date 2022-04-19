import {
  hackathonTable,
  mockGetItem,
  mockPutItem,
  mockQuery,
  mockSend,
  mockUpdateItem,
} from './dynamo-db-mock';
import {
  appendCategoryId,
  appendIdeaId,
  appendParticipantId,
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
import {safeTransformArray} from '../../src/repository/dynamo-db';

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

describe('Append Participant ID', () => {
  test('Happy Path', async () => {
    mockUpdateItem();
    const hackathonId = uuid();
    const participantId = uuid();

    await appendParticipantId(hackathonId, participantId);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: hackathonTable,
            Key: {id: {S: hackathonId}},
            UpdateExpression: 'ADD participantIds :participant_id',
            ExpressionAttributeValues: {
              ':participant_id': {SS: [participantId]},
            },
          }),
        }));
  });
});

describe('Append Category ID', () => {
  test('Happy Path', async () => {
    mockUpdateItem();
    const hackathonId = uuid();
    const categoryId = uuid();

    await appendCategoryId(hackathonId, categoryId);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: hackathonTable,
            Key: {id: {S: hackathonId}},
            UpdateExpression: 'ADD categoryIds :category_id',
            ExpressionAttributeValues: {
              ':category_id': {SS: [categoryId]},
            },
          }),
        }));
  });
});

describe('Append Idea ID', () => {
  test('Happy Path', async () => {
    mockUpdateItem();
    const hackathonId = uuid();
    const ideaId = uuid();

    await appendIdeaId(hackathonId, ideaId);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: hackathonTable,
            Key: {id: {S: hackathonId}},
            UpdateExpression: 'ADD ideaIds :idea_id',
            ExpressionAttributeValues: {
              ':idea_id': {SS: [ideaId]},
            },
          }),
        }));
  });
});

describe('Delete Hackathon', () => {
  test('Happy Path', async () => {
    const id = uuid();

    await deleteHackathon(id);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: hackathonTable,
            Key: {id: {S: id}},
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
  participantIds: safeTransformArray(hackathon.participantIds),
  categoryIds: safeTransformArray(hackathon.categoryIds),
  ideaIds: safeTransformArray(hackathon.ideaIds),
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
