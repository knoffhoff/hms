import {mockGetItem, mockGetItemOnce, mockQuery} from './dynamo-db-mock';
import {
  getParticipant,
  getParticipants,
  listParticipants,
  participantExists,
} from '../../src/repository/participant-repository';
import {uuid} from '../../src/util/uuids';
import NotFoundError from '../../src/repository/error/NotFoundError';
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
  });

  test('Participant exists', async () => {
    const expected = randomParticipant();
    mockGetItem(itemFromParticipant(expected));

    expect(await getParticipant(expected.id)).toStrictEqual(expected);
  });
});

describe('Get Participants', () => {
  test('All participants missing', async () => {
    mockGetItemOnce(null);
    mockGetItemOnce(null);
    await expect(getParticipants([uuid(), uuid()]))
        .rejects
        .toThrow(NotFoundError);
  });

  test('1 participant missing', async () => {
    const participant1 = randomParticipant();
    mockGetItemOnce(itemFromParticipant(participant1));
    mockGetItemOnce(null);
    await expect(getParticipants([participant1.id, uuid()]))
        .rejects
        .toThrow(NotFoundError);
  });

  test('0 participants missing', async () => {
    const participant1 = randomParticipant();
    mockGetItemOnce(itemFromParticipant(participant1));
    const participant2 = randomParticipant();
    mockGetItemOnce(itemFromParticipant(participant2));
    expect(await getParticipants([participant1.id, participant2.id]))
        .toStrictEqual([participant1, participant2]);
  });
});

describe('List Participants', () => {
  test('Query returns null', async () => {
    const hackathonId = uuid();
    mockQuery(null);

    await expect(listParticipants(hackathonId))
        .rejects
        .toThrow(NotFoundError);
  });

  test('0 Participants exist', async () => {
    const hackathonId = uuid();
    mockQuery([]);

    expect(await listParticipants(hackathonId)).toStrictEqual([]);
  });

  test('1 Participant exists', async () => {
    const hackathonId = uuid();
    const participant = makeParticipant(
        {hackathonId: hackathonId} as ParticipantData);
    mockQuery([itemFromParticipant(participant)]);

    expect(await listParticipants(hackathonId)).toStrictEqual([participant]);
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
  });
});

describe('Participant Exists', () => {
  test('Item is non-null', async () => {
    mockGetItem({});

    expect(await participantExists(uuid())).toBe(true);
  });

  test('Item is null', async () => {
    mockGetItem(null);

    expect(await participantExists(uuid())).toBe(false);
  });
});

const itemFromParticipant = (participant: Participant)
    : { [key: string]: AttributeValue } => ({
  userId: {S: participant.userId},
  hackathonId: {S: participant.hackathonId},
  id: {S: participant.id},
  creationDate: {S: participant.creationDate.toISOString()},
});
