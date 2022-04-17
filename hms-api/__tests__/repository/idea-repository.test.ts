import {
  ideaByHackathonIdIndex,
  ideaTable,
  mockGetItem,
  mockPutItem,
  mockQuery,
  mockSend,
} from './dynamo-db-mock';
import {
  deleteIdea,
  getIdea,
  listIdeas,
  putIdea,
} from '../../src/repository/idea-repository';
import Uuid, {uuid} from '../../src/util/Uuid';
import NotFoundError from '../../src/repository/error/NotFoundError';
import {IdeaData, makeIdea, randomIdea} from './domain/idea-maker';
import Idea from '../../src/repository/domain/Idea';
import {AttributeValue} from '@aws-sdk/client-dynamodb';
import {safeTransformArray} from '../../src/repository/dynamo-db';

describe('Get Idea', () => {
  test('Idea doesn\'t exist', async () => {
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
        }));
  });
});

describe('Delete Idea', () => {
  test('Happy Path', async () => {
    const id = uuid();

    await deleteIdea(id);

    expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          input: expect.objectContaining({
            TableName: ideaTable,
            Key: {id: {S: id}},
          }),
        }),
    );
  });
});

describe('List Ideas', () => {
  test('Query returns null', async () => {
    const hackathonId = uuid();
    mockQuery(null);

    await expect(listIdeas(hackathonId))
        .rejects
        .toThrow(NotFoundError);

    listExpected(hackathonId);
  });

  test('0 Ideas exist', async () => {
    const hackathonId = uuid();
    mockQuery([]);

    expect(await listIdeas(hackathonId)).toStrictEqual([]);

    listExpected(hackathonId);
  });

  test('1 Idea exists', async () => {
    const hackathonId = uuid();
    const idea = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockQuery([itemFromIdea(idea)]);

    expect(await listIdeas(hackathonId)).toStrictEqual([idea]);

    listExpected(hackathonId);
  });

  test('2 Ideas exist', async () => {
    const hackathonId = uuid();
    const idea1 = makeIdea({hackathonId: hackathonId} as IdeaData);
    const idea2 = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockQuery([itemFromIdea(idea1), itemFromIdea(idea2)]);

    expect(await listIdeas(hackathonId)).toStrictEqual([idea1, idea2]);

    listExpected(hackathonId);
  });
});

const itemFromIdea = (idea: Idea): { [key: string]: AttributeValue } => ({
  id: {S: idea.id},
  ownerId: {S: idea.ownerId},
  hackathonId: {S: idea.hackathonId},
  participantIds: safeTransformArray(idea.participantIds),
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
      }));

const listExpected = (hackathonId: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaTable,
          IndexName: ideaByHackathonIdIndex,
          KeyConditionExpression: 'hackathonId = :hId',
          ExpressionAttributeValues: {':hId': {'S': hackathonId}},
        }),
      }));
