import {
  ideaByCategoryIdIndex,
  ideaByHackathonIdIndex,
  ideaByOwnerIdIndex,
  ideaTable,
  mockDeleteItem,
  mockGetItem,
  mockPutItem,
  mockQuery,
  mockScan,
  mockSend,
} from './dynamo-db-mock';
import {
  addParticipantToIdea,
  addVoterToIdea,
  deleteIdea,
  deleteParticipantFromIdea,
  deleteVoterFromIdea,
  getIdea,
  listIdeasForCategory,
  listIdeasForHackathon,
  listIdeasForOwner,
  listIdeasForParticipant,
  putIdea,
} from '../../src/repository/idea-repository';
import Uuid, {uuid} from '../../src/util/Uuid';
import NotFoundError from '../../src/error/NotFoundError';
import {IdeaData, makeIdea, randomIdea} from './domain/idea-maker';
import Idea from '../../src/repository/domain/Idea';
import {AttributeValue} from '@aws-sdk/client-dynamodb';
import {safeTransformArray} from '../../src/repository/dynamo-db';

describe('Get Idea', () => {
  test("Idea doesn't exist", async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getIdea(id)).rejects.toThrow(NotFoundError);

    getExpected(id);
  });

  test('Idea exists', async () => {
    const expected = randomIdea();
    mockGetItem(itemFromIdea(expected));

    expect(await getIdea(expected.id)).toStrictEqual(expected);

    getExpected(expected.id);
  });
});

describe('Put Idea', () => {
  test('Happy Path', async () => {
    mockPutItem();
    const expected = randomIdea();

    await putIdea(expected);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaTable,
          Item: itemFromIdea(expected),
        }),
      }),
    );
  });
});

describe('Delete Idea', () => {
  test('Happy Path', async () => {
    const expected = randomIdea();
    mockDeleteItem(itemFromIdea(expected));

    expect(await deleteIdea(expected.id)).toStrictEqual(expected);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaTable,
          Key: {id: {S: expected.id}},
          ReturnValues: 'ALL_OLD',
        }),
      }),
    );
  });

  test('Idea not found', async () => {
    const id = uuid();
    mockDeleteItem(null);

    await expect(deleteIdea(id)).rejects.toThrow(NotFoundError);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaTable,
          Key: {id: {S: id}},
          ReturnValues: 'ALL_OLD',
        }),
      }),
    );
  });
});

describe('Add Participant to Idea', () => {
  test('Happy Path', async () => {
    const expected = randomIdea();
    mockGetItem(itemFromIdea(expected));
    const participantId = uuid();

    await addParticipantToIdea(expected.id, participantId);

    expected.participantIds.push(participantId);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaTable,
          Item: itemFromIdea(expected),
        }),
      }),
    );
  });

  describe('Add Voter to Idea', () => {
    test('Happy Path', async () => {
      const expected = randomIdea();
      mockGetItem(itemFromIdea(expected));
      const voterId = uuid();

      await addVoterToIdea(expected.id, voterId);

      expected.voterIds.push(voterId);

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: ideaTable,
            Item: itemFromIdea(expected),
          }),
        }),
      );
    });
  });

  test('Ignore already added participant', async () => {
    const idea = randomIdea();
    const participantId = uuid();
    idea.participantIds.push(participantId);
    mockGetItem(itemFromIdea(idea));

    await addParticipantToIdea(idea.id, participantId);

    expect(mockSend).not.toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaTable,
          Item: itemFromIdea(idea),
        }),
      }),
    );
  });

  test('Ignore already added voter', async () => {
    const idea = randomIdea();
    const voterId = uuid();
    idea.voterIds.push(voterId);
    mockGetItem(itemFromIdea(idea));

    await addVoterToIdea(idea.id, voterId);

    expect(mockSend).not.toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaTable,
          Item: itemFromIdea(idea),
        }),
      }),
    );
  });
});

describe('Delete Participant from Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const participantId = uuid();

    await deleteParticipantFromIdea(ideaId, participantId);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: process.env.IDEA_TABLE,
          Key: {id: {S: ideaId}},
          UpdateExpression: 'DELETE participantIds :participant_id',
          ExpressionAttributeValues: {
            ':participant_id': {SS: [participantId]},
          },
        }),
      }),
    );
  });
});

describe('Delete Voter from Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const voterId = uuid();

    await deleteVoterFromIdea(ideaId, voterId);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: process.env.IDEA_TABLE,
          Key: {id: {S: ideaId}},
          UpdateExpression: 'DELETE voterIds :voter_id',
          ExpressionAttributeValues: {
            ':voter_id': {SS: [voterId]},
          },
        }),
      }),
    );
  });
});

describe('List Ideas for Hackathon', () => {
  test('Query returns null', async () => {
    const hackathonId = uuid();
    mockQuery(null);

    await expect(listIdeasForHackathon(hackathonId)).rejects.toThrow(
      NotFoundError,
    );

    listHackathonExpected(hackathonId);
  });

  test('0 Ideas exist', async () => {
    const hackathonId = uuid();
    mockQuery([]);

    expect(await listIdeasForHackathon(hackathonId)).toStrictEqual([]);

    listHackathonExpected(hackathonId);
  });

  test('1 Idea exists', async () => {
    const hackathonId = uuid();
    const idea = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockQuery([itemFromIdea(idea)]);

    expect(await listIdeasForHackathon(hackathonId)).toStrictEqual([idea]);

    listHackathonExpected(hackathonId);
  });

  test('2 Ideas exist', async () => {
    const hackathonId = uuid();
    const idea1 = makeIdea({hackathonId: hackathonId} as IdeaData);
    const idea2 = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockQuery([itemFromIdea(idea1), itemFromIdea(idea2)]);

    expect(await listIdeasForHackathon(hackathonId)).toStrictEqual([
      idea1,
      idea2,
    ]);

    listHackathonExpected(hackathonId);
  });
});

describe('List Ideas for Owner', () => {
  test('Query returns null', async () => {
    const ownerId = uuid();
    mockQuery(null);

    await expect(listIdeasForOwner(ownerId)).rejects.toThrow(NotFoundError);

    listOwnerExpected(ownerId);
  });

  test('0 Ideas exist', async () => {
    const ownerId = uuid();
    mockQuery([]);

    expect(await listIdeasForOwner(ownerId)).toStrictEqual([]);

    listOwnerExpected(ownerId);
  });

  test('1 Idea exists', async () => {
    const ownerId = uuid();
    const idea = makeIdea({ownerId: ownerId} as IdeaData);
    mockQuery([itemFromIdea(idea)]);

    expect(await listIdeasForOwner(ownerId)).toStrictEqual([idea]);

    listOwnerExpected(ownerId);
  });

  test('2 Ideas exist', async () => {
    const ownerId = uuid();
    const idea1 = makeIdea({ownerId: ownerId} as IdeaData);
    const idea2 = makeIdea({ownerId: ownerId} as IdeaData);
    mockQuery([itemFromIdea(idea1), itemFromIdea(idea2)]);

    expect(await listIdeasForOwner(ownerId)).toStrictEqual([idea1, idea2]);

    listOwnerExpected(ownerId);
  });
});

describe('List Ideas for Participant', () => {
  test('Query returns null', async () => {
    const participantId = uuid();
    mockScan(null);

    await expect(listIdeasForParticipant(participantId)).rejects.toThrow(
      NotFoundError,
    );

    scanParticipantExpected(participantId);
  });

  test('0 Ideas exist', async () => {
    const participantId = uuid();
    mockScan([]);

    expect(await listIdeasForParticipant(participantId)).toStrictEqual([]);

    scanParticipantExpected(participantId);
  });

  test('1 Idea exists', async () => {
    const participantId = uuid();
    const idea = makeIdea({participantIds: [participantId]} as IdeaData);
    mockScan([itemFromIdea(idea)]);

    expect(await listIdeasForParticipant(participantId)).toStrictEqual([idea]);

    scanParticipantExpected(participantId);
  });

  test('2 Ideas exist', async () => {
    const participantId = uuid();
    const idea1 = makeIdea({participantIds: [participantId]} as IdeaData);
    const idea2 = makeIdea({participantIds: [participantId]} as IdeaData);
    mockScan([itemFromIdea(idea1), itemFromIdea(idea2)]);

    expect(await listIdeasForParticipant(participantId)).toStrictEqual([
      idea1,
      idea2,
    ]);

    scanParticipantExpected(participantId);
  });
});

describe('List Ideas for Category', () => {
  test('Query returns null', async () => {
    const categoryId = uuid();
    mockScan(null);

    await expect(listIdeasForCategory(categoryId)).rejects.toThrow(
      NotFoundError,
    );

    listCategoryExpected(categoryId);
  });

  test('0 Ideas exist', async () => {
    const categoryId = uuid();
    mockScan([]);

    expect(await listIdeasForCategory(categoryId)).toStrictEqual([]);

    listCategoryExpected(categoryId);
  });

  test('1 Idea exists', async () => {
    const categoryId = uuid();
    const idea = makeIdea({categoryId: categoryId} as IdeaData);
    mockScan([itemFromIdea(idea)]);

    expect(await listIdeasForCategory(categoryId)).toStrictEqual([idea]);

    listCategoryExpected(categoryId);
  });

  test('2 Ideas exist', async () => {
    const categoryId = uuid();
    const idea1 = makeIdea({categoryId: categoryId} as IdeaData);
    const idea2 = makeIdea({categoryId: categoryId} as IdeaData);
    mockScan([itemFromIdea(idea1), itemFromIdea(idea2)]);

    expect(await listIdeasForCategory(categoryId)).toStrictEqual([
      idea1,
      idea2,
    ]);

    listCategoryExpected(categoryId);
  });
});

const itemFromIdea = (idea: Idea): {[key: string]: AttributeValue} => ({
  id: {S: idea.id},
  ownerId: {S: idea.ownerId},
  hackathonId: {S: idea.hackathonId},
  participantIds: safeTransformArray(idea.participantIds),
  voterIds: safeTransformArray(idea.voterIds),
  title: {S: idea.title},
  description: {S: idea.description},
  problem: {S: idea.problem},
  goal: {S: idea.goal},
  requiredSkills: safeTransformArray(idea.requiredSkills),
  categoryId: {S: idea.categoryId},
  creationDate: {S: idea.creationDate.toISOString()},
});

const getExpected = (id: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: ideaTable,
        Key: {id: {S: id}},
      }),
    }),
  );

const listHackathonExpected = (hackathonId: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: ideaTable,
        IndexName: ideaByHackathonIdIndex,
        KeyConditionExpression: 'hackathonId = :hId',
        ExpressionAttributeValues: {':hId': {S: hackathonId}},
      }),
    }),
  );

const listOwnerExpected = (ownerId: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: ideaTable,
        IndexName: ideaByOwnerIdIndex,
        KeyConditionExpression: 'ownerId = :oId',
        ExpressionAttributeValues: {':oId': {S: ownerId}},
      }),
    }),
  );

const listCategoryExpected = (categoryId: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: ideaTable,
        IndexName: ideaByCategoryIdIndex,
        KeyConditionExpression: 'categoryId = :cId',
        ExpressionAttributeValues: {':cId': {S: categoryId}},
      }),
    }),
  );

const scanParticipantExpected = (participantId: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: ideaTable,
        FilterExpression: 'contains(participantIds, :pId)',
        ExpressionAttributeValues: {':pId': {S: participantId}},
      }),
    }),
  );
