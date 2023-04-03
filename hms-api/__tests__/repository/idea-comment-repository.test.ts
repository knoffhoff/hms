import Uuid, { uuid } from '../../src/util/Uuid'
import {
  ideaCommentTable,
  mockDeleteItem,
  mockGetItem,
  mockGetItemOnce,
  mockPutItemOnce,
  mockQuery,
  mockQueryOnce,
  mockSend,
} from './dynamo-db-mock'
import {
  deleteIdeaComment,
  getIdeaComment,
  getIdeaComments,
  ideaCommentAlreadyExists,
  listIdeaComments,
  putIdeaComment,
} from '../../src/repository/idea-comment-repository'
import NotFoundError from '../../src/error/NotFoundError'
import { IdeaCommentData, makeIdeaComment, randomIdeaComment, } from './domain/ideaComment-maker'
import { AttributeValue } from '@aws-sdk/client-dynamodb'
import IdeaComment from '../../src/repository/domain/IdeaComment'
import { randomIdea } from './domain/idea-maker'

describe('Get Idea Comment', () => {
  test('Idea Comment does not exist', async () => {
    const id = uuid()
    mockGetItem(null)

    await expect(getIdeaComment(id)).rejects.toThrow(NotFoundError)

    getExpected(id)
  })

  test('Idea Comment exists', async () => {
    const expected = randomIdeaComment()
    mockGetItem(itemFromIdeaComment(expected))

    expect(await getIdeaComment(expected.id)).toStrictEqual(expected)

    getExpected(expected.id)
  })
})
describe('List Idea Comments', () => {
  const idea = randomIdea()
  const ideaComment = makeIdeaComment({ ideaId: idea.id } as IdeaCommentData)

  test('Happy Path', async () => {
    mockQuery([itemFromIdeaComment(ideaComment)])

    expect(await listIdeaComments(idea.id)).toStrictEqual([ideaComment])

    listExpected()
  })

  test('Empty Array Response', async () => {
    mockQuery([])

    expect(await listIdeaComments(idea.id)).toStrictEqual([])

    listExpected()
  })

  test('Null Response', async () => {
    mockQuery(null)

    await expect(listIdeaComments(idea.id)).rejects.toThrow(NotFoundError)

    listExpected()
  })
})

describe('Idea Comment Already Exists', () => {
  test('Happy Path', async () => {
    const ideaComment = randomIdeaComment()
    mockQuery([itemFromIdeaComment(ideaComment)])

    expect(await ideaCommentAlreadyExists(ideaComment)).toStrictEqual(true)
  })

  test('Empty Array Response', async () => {
    mockQuery([])

    expect(await ideaCommentAlreadyExists(randomIdeaComment())).toStrictEqual(
      false,
    )
  })

  test('Null Response', async () => {
    mockQuery(null)

    expect(await ideaCommentAlreadyExists(randomIdeaComment())).toStrictEqual(
      false,
    )
  })
})

describe('Put Idea Comment', () => {
  test('Happy Path', async () => {
    mockQueryOnce(null)
    mockPutItemOnce()

    const expected = randomIdeaComment()
    await putIdeaComment(expected)

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaCommentTable,
          Item: itemFromIdeaComment(expected),
        }),
      }),
    )
  })
})

describe('Delete Idea Comment', () => {
  test('Happy Path', async () => {
    const expected = randomIdeaComment()
    mockDeleteItem(itemFromIdeaComment(expected))

    expect(await deleteIdeaComment(expected.id)).toStrictEqual(expected)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaCommentTable,
          Key: {
            id: { S: expected.id },
          },
          ReturnValues: 'ALL_OLD',
        }),
      }),
    )
  })

  test('Idea Comment not found', async () => {
    const id = uuid()
    mockDeleteItem(null)

    await expect(deleteIdeaComment(id)).rejects.toThrow(NotFoundError)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: ideaCommentTable,
          Key: {
            id: { S: id },
          },
          ReturnValues: 'ALL_OLD',
        }),
      }),
    )
  })
})

describe('Get Idea Comments', () => {
  test('All Idea comments missing', async () => {
    mockGetItemOnce(null)
    mockGetItemOnce(null)
    const id = uuid()
    await expect(getIdeaComments([id, uuid()])).rejects.toThrow(NotFoundError)

    getExpected(id)
  })

  test('One Idea comment missing', async () => {
    const ideaComment = randomIdeaComment()
    mockGetItemOnce(itemFromIdeaComment(ideaComment))
    mockGetItemOnce(null)
    const id = uuid()
    await expect(getIdeaComments([ideaComment.id, id])).rejects.toThrow(
      NotFoundError,
    )

    getExpected(ideaComment.id)
    getExpected(id)
  })

  test('0 Idea comments missing', async () => {
    const ideaComment = randomIdeaComment()
    const ideaComment2 = randomIdeaComment()
    mockGetItemOnce(itemFromIdeaComment(ideaComment))
    mockGetItemOnce(itemFromIdeaComment(ideaComment2))
    const comments = await getIdeaComments([ideaComment.id, ideaComment2.id])

    expect(comments).toStrictEqual([ideaComment, ideaComment2])

    getExpected(ideaComment.id)
    getExpected(ideaComment2.id)
  })
})

const itemFromIdeaComment = (
  ideaComment: IdeaComment,
): { [key: string]: AttributeValue } => ({
  id: { S: ideaComment.id },
  ideaId: { S: ideaComment.ideaId },
  userId: { S: ideaComment.userId },
  text: { S: ideaComment.text },
  creationDate: { S: ideaComment.creationDate.toISOString() },
  parentIdeaCommentId: { S: ideaComment.parentIdeaCommentId },
})

const getExpected = (id: Uuid) =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: ideaCommentTable,
        Key: { id: { S: id } },
      }),
    }),
  )

const listExpected = () =>
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      input: expect.objectContaining({
        TableName: ideaCommentTable,
      }),
    }),
  )
