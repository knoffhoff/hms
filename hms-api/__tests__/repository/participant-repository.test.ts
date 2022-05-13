import {
  mockDeleteItem,
  mockGetItem,
  mockGetItemOnce,
  mockPutItem,
  mockQuery,
  mockSend,
  participantByHackathonIdIndex,
  participantTable,
} from './dynamo-db-mock';
import {
  deleteParticipant,
  getParticipant,
  getParticipants,
  listParticipants,
  participantExists,
  putParticipant,
} from '../../src/repository/participant-repository';
import Uuid, {uuid} from '../../src/util/Uuid';
import NotFoundError from '../../src/error/NotFoundError';
import {
  makeParticipant,
  ParticipantData,
  randomParticipant,
} from './domain/participant-maker';
import Participant from '../../src/repository/domain/Participant';
import {AttributeValue} from '@aws-sdk/client-dynamodb';

describe('Get Participant', () => {
  test('Participant doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getParticipant(id)).rejects.toThrow(NotFoundError);

    getExpected(id);
  });

  test('Participant exists', async () => {
    const expected = randomParticipant();
    mockGetItem(itemFromParticipant(expected));

    expect(await getParticipant(expected.id)).toStrictEqual(expected);

    getExpected(expected.id);
  });
});

describe('Put Participant', () => {
  test('Happy Path', async () => {
    mockPutItem();
    const expected = randomParticipant();

    await putParticipant(expected);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: participantTable,
            Item: itemFromParticipant(expected),
          }),
        }));
  });

  // TODO add a test for the ConditionalCheckFailedException
});

describe('Delete Participant', () => {
  test('Happy Path', async () => {
    const expected = randomParticipant();
    mockDeleteItem(itemFromParticipant(expected));

    expect(await deleteParticipant(expected.id)).toStrictEqual(expected);
    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: participantTable,
            Key: {id: {S: expected.id}},
            ReturnValues: 'ALL_OLD',
          }),
        }),
    );
  });

  test('Participant not found', async () => {
    const id = uuid();
    mockDeleteItem(null);

    await expect(deleteParticipant(id))
        .rejects
        .toThrow(NotFoundError);
    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: participantTable,
            Key: {id: {S: id}},
            ReturnValues: 'ALL_OLD',
          }),
        }),
    );
  });
});

describe('Get Participants', () => {
  test('All participants missing', async () => {
    mockGetItemOnce(null);
    mockGetItemOnce(null);
    const id1 = uuid();
    await expect(getParticipants([id1, uuid()]))
        .rejects
        .toThrow(NotFoundError);

    getExpected(id1);
  });

  test('1 participant missing', async () => {
    const participant1 = randomParticipant();
    mockGetItemOnce(itemFromParticipant(participant1));
    mockGetItemOnce(null);
    const id2 = uuid();
    await expect(getParticipants([participant1.id, id2]))
        .rejects
        .toThrow(NotFoundError);

    getExpected(participant1.id);
    getExpected(id2);
  });

  test('0 participants missing', async () => {
    const participant1 = randomParticipant();
    mockGetItemOnce(itemFromParticipant(participant1));
    const participant2 = randomParticipant();
    mockGetItemOnce(itemFromParticipant(participant2));
    expect(await getParticipants([participant1.id, participant2.id]))
        .toStrictEqual([participant1, participant2]);

    getExpected(participant1.id);
    getExpected(participant2.id);
  });
});

describe('List Participants', () => {
  test('Query returns null', async () => {
    const hackathonId = uuid();
    mockQuery(null);

    await expect(listParticipants(hackathonId))
        .rejects
        .toThrow(NotFoundError);

    listExpected(hackathonId);
  });

  test('0 Participants exist', async () => {
    const hackathonId = uuid();
    mockQuery([]);

    expect(await listParticipants(hackathonId)).toStrictEqual([]);

    listExpected(hackathonId);
  });

  test('1 Participant exists', async () => {
    const hackathonId = uuid();
    const participant = makeParticipant(
        {hackathonId: hackathonId} as ParticipantData);
    mockQuery([itemFromParticipant(participant)]);

    expect(await listParticipants(hackathonId)).toStrictEqual([participant]);

    listExpected(hackathonId);
  });

  test('2 Participants exist', async () => {
    const hackathonId = uuid();
    const participant1 = makeParticipant(
        {hackathonId: hackathonId} as ParticipantData);
    const participant2 = makeParticipant(
        {hackathonId: hackathonId} as ParticipantData);
    mockQuery([
      itemFromParticipant(participant1),
      itemFromParticipant(participant2),
    ]);

    expect(await listParticipants(hackathonId))
        .toStrictEqual([participant1, participant2]);

    listExpected(hackathonId);
  });
});

describe('Participant Exists', () => {
  test('Item is null', async () => {
    const id = uuid();
    mockGetItem(null);

    expect(await participantExists(id, uuid())).toBe(false);

    getExpected(id);
  });

  test('HackathonId does not match', async () => {
    const id = uuid();
    mockGetItem({
      hackathonId: {S: uuid()},
    });

    expect(await participantExists(id, uuid())).toBe(false);

    getExpected(id);
  });

  test('HackathonId matches', async () => {
    const id = uuid();
    const hackathonId = uuid();
    mockGetItem({
      hackathonId: {S: hackathonId},
    });

    expect(await participantExists(id, hackathonId)).toBe(true);

    getExpected(id);
  });
});

const itemFromParticipant = (
    participant: Participant,
): { [key: string]: AttributeValue } => ({
  userId: {S: participant.userId},
  hackathonId: {S: participant.hackathonId},
  id: {S: participant.id},
  creationDate: {S: participant.creationDate.toISOString()},
});

const getExpected = (
    id: Uuid,
) => expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: participantTable,
        Key: {id: {S: id}},
      }),
    }));

const listExpected = (
    hackathonId: Uuid,
) => expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: participantTable,
        IndexName: participantByHackathonIdIndex,
        KeyConditionExpression: 'hackathonId = :hId',
        ExpressionAttributeValues: {':hId': {'S': hackathonId}},
      }),
    }));
