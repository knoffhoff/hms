import Uuid, {uuid} from '../../src/util/Uuid';
import {
  commentTable,
  mockDeleteItem,
  mockGetItem,
  mockGetItemOnce,
  mockPutItemOnce,
  mockQuery,
  mockQueryOnce,
  mockSend,
  participantTable,
} from './dynamo-db-mock';
import {
  commentAlreadyExists,
  deleteComment,
  getComment,
  getComments,
  listComments,
  putComment,
} from '../../src/repository/idea_comment-repository';
import NotFoundError from '../../src/error/NotFoundError';
import {randomIdeaComment} from './domain/ideaComment-maker';
import {AttributeValue} from '@aws-sdk/client-dynamodb';
import IdeaComment from '../../src/repository/domain/IdeaComment';
import InvalidStateError from '../../src/error/InvalidStateError';

describe('Get Comment', () => {
  test('Comment does not exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getComment(id)).rejects.toThrow(NotFoundError);

    getExpected(id);
  });

  test('Comment exists', async () => {
    const expected = randomIdeaComment();
    mockGetItem(itemFromComment(expected));

    expect(await getComment(expected.id)).toStrictEqual(expected);

    getExpected(expected.id);
  });
});

describe('Comment Already Exists', () => {
  test('Happy Path', async () => {
    const comment = randomIdeaComment();
    mockQuery([itemFromComment(comment)]);

    expect(await commentAlreadyExists(comment)).toStrictEqual(true);
  });

  test('Empty Array Response', async () => {
    mockQuery([]);

    expect(await commentAlreadyExists(randomIdeaComment())).toStrictEqual(
      false,
    );
  });

  test('Null Response', async () => {
    mockQuery(null);

    expect(await commentAlreadyExists(randomIdeaComment())).toStrictEqual(
      false,
    );
  });
});

describe('Put Comment', () => {
  test('Happy Path', async () => {
    mockQueryOnce(null);
    mockPutItemOnce();

    const expected = randomIdeaComment();
    await putComment(expected);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: commentTable,
          Item: itemFromComment(expected),
        }),
      }),
    );
  });
});

describe('Delete Comment', () => {
  test('Happy Path', async () => {
    const expected = randomIdeaComment();
    mockDeleteItem(itemFromComment(expected));

    expect(await deleteComment(expected.id)).toStrictEqual(expected);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: commentTable,
          Key: {
            id: {S: expected.id},
          },
          ReturnValues: 'ALL_OLD',
        }),
      }),
    );
  });

  test('Comment not found', async () => {
    const id = uuid();
    mockDeleteItem(null);

    await expect(deleteComment(id)).rejects.toThrow(NotFoundError);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: commentTable,
          Key: {
            id: {S: id},
          },
          ReturnValues: 'ALL_OLD',
        }),
      }),
    );
  });
});

describe('Get Comment', () => {
  test('All comments missing', async () => {
    mockGetItemOnce(null);
    mockGetItemOnce(null);
    const id = uuid();
    await expect(getComments([id, uuid()])).rejects.toThrow(NotFoundError);

    getExpected(id);
  });

  test('One comment missing', async () => {
    const comment = randomIdeaComment();
    mockGetItemOnce(itemFromComment(comment));
    mockGetItemOnce(null);
    const id = uuid();
    await expect(getComments([comment.id, id])).rejects.toThrow(NotFoundError);

    getExpected(comment.id);
    getExpected(id);
  });

  test('0 comments missing', async () => {
    const comment1 = randomIdeaComment();
    const comment2 = randomIdeaComment();
    mockGetItemOnce(itemFromComment(comment1));
    mockGetItemOnce(itemFromComment(comment2));
    const comments = await getComments([comment1.id, comment2.id]);

    expect(comments).toStrictEqual([comment1, comment2]);

    getExpected(comment1.id);
    getExpected(comment2.id);
  });
});

const itemFromComment = (
  comment: IdeaComment,
): {[key: string]: AttributeValue} => ({
  id: {S: comment.id},
  ideaId: {S: comment.ideaId},
  userId: {S: comment.userId},
  text: {S: comment.text},
  replyTo: {S: comment.replyTo},
  creationDate: {S: comment.creationDate.toISOString()},
});

const getExpected = (id: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: commentTable,
        Key: {id: {S: id}},
      }),
    }),
  );
