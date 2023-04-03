import {
  mockDeleteItem,
  mockGetItem,
  mockGetItemOnce,
  mockPutItem,
  mockQuery,
  mockSend,
  skillTable,
} from './dynamo-db-mock'
import {
  deleteSkill,
  getSkill,
  getSkills,
  listSkills,
  putSkill,
  skillExists,
} from '../../src/repository/skill-repository'
import Uuid, { uuid } from '../../src/util/Uuid'
import NotFoundError from '../../src/error/NotFoundError'
import { randomSkill } from './domain/skill-maker'
import Skill from '../../src/repository/domain/Skill'
import { AttributeValue } from '@aws-sdk/client-dynamodb'

describe('Get Skill', () => {
  test('Skill doesn\'t exist', async () => {
    const id = uuid()
    mockGetItem(null)

    await expect(getSkill(id)).rejects.toThrow(NotFoundError)

    getExpected(id)
  })

  test('Skill exists', async () => {
    const expected = randomSkill()
    mockGetItem(itemFromSkill(expected))

    expect(await getSkill(expected.id)).toStrictEqual(expected)

    getExpected(expected.id)
  })
})

describe('Put Skill', () => {
  test('Happy Path', async () => {
    mockPutItem()
    const expected = randomSkill()

    await putSkill(expected)

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: skillTable,
          Item: itemFromSkill(expected),
        }),
      }))
  })
})

describe('Delete Skill', () => {
  test('Happy Path', async () => {
    const expected = randomSkill()
    mockDeleteItem(itemFromSkill(expected))

    expect(await deleteSkill(expected.id)).toStrictEqual(expected)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: skillTable,
          Key: { id: { S: expected.id } },
          ReturnValues: 'ALL_OLD',
        }),
      }),
    )
  })

  test('Skill not found', async () => {
    const id = uuid()
    mockDeleteItem(null)

    await expect(deleteSkill(id))
      .rejects
      .toThrow(NotFoundError)
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          TableName: skillTable,
          Key: { id: { S: id } },
          ReturnValues: 'ALL_OLD',
        }),
      }),
    )
  })
})

describe('Get Skills', () => {
  test('All skills missing', async () => {
    mockGetItemOnce(null)
    mockGetItemOnce(null)
    const id1 = uuid()
    await expect(getSkills([id1, uuid()]))
      .rejects
      .toThrow(NotFoundError)

    getExpected(id1)
  })

  test('1 skill missing', async () => {
    const skill1 = randomSkill()
    mockGetItemOnce(itemFromSkill(skill1))
    mockGetItemOnce(null)
    const id2 = uuid()
    await expect(getSkills([skill1.id, id2]))
      .rejects
      .toThrow(NotFoundError)

    getExpected(skill1.id)
    getExpected(id2)
  })

  test('0 skills missing', async () => {
    const skill1 = randomSkill()
    mockGetItemOnce(itemFromSkill(skill1))
    const skill2 = randomSkill()
    mockGetItemOnce(itemFromSkill(skill2))
    expect(await getSkills([skill1.id, skill2.id]))
      .toStrictEqual([skill1, skill2])

    getExpected(skill1.id)
    getExpected(skill2.id)
  })
})

describe('List Skills', () => {
  test('Query returns null', async () => {
    mockQuery(null)

    await expect(listSkills()).rejects.toThrow(NotFoundError)

    listExpected()
  })

  test('0 Skills exist', async () => {
    mockQuery([])

    expect(await listSkills()).toStrictEqual([])

    listExpected()
  })

  test('1 Skill exists', async () => {
    const skill = randomSkill()
    mockQuery([itemFromSkill(skill)])

    expect(await listSkills()).toStrictEqual([skill])

    listExpected()
  })

  test('2 Skills exist', async () => {
    const skill1 = randomSkill()
    const skill2 = randomSkill()
    mockQuery([
      itemFromSkill(skill1),
      itemFromSkill(skill2),
    ])

    expect(await listSkills()).toStrictEqual([skill1, skill2])

    listExpected()
  })
})

describe('Skill Exists', () => {
  test('Item is non-null', async () => {
    mockGetItem({})

    const id = uuid()
    expect(await skillExists(id)).toBe(true)

    getExpected(id)
  })

  test('Item is null', async () => {
    mockGetItem(null)

    const id = uuid()
    expect(await skillExists(id)).toBe(false)

    getExpected(id)
  })
})

const itemFromSkill = (skill: Skill): { [key: string]: AttributeValue } => ({
  id: { S: skill.id },
  name: { S: skill.name },
  description: { S: skill.description },
})

const getExpected = (id: Uuid) => expect(mockSend).toHaveBeenCalledWith(
  expect.objectContaining({
    input: expect.objectContaining({
      TableName: skillTable,
      Key: { id: { S: id } },
    }),
  }))

const listExpected = () => expect(mockSend).toHaveBeenCalledWith(
  expect.objectContaining({
    input: expect.objectContaining({
      TableName: skillTable,
    }),
  }))

