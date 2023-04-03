/* eslint-disable require-jsdoc */
// TODO add paging for lists

import { getClient } from './dynamo-db'
import Skill from './domain/Skill'
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb'
import Uuid from '../util/Uuid'
import NotFoundError from '../error/NotFoundError'

const dynamoDBClient = getClient()

export async function listSkills(): Promise<Skill[]> {
  const output = await dynamoDBClient.send(
    new ScanCommand({
      TableName: process.env.SKILL_TABLE,
    }),
  )

  const items = output.Items
  if (items) {
    return items.map((item) => itemToSkill(item))
  }

  throw new NotFoundError(`Failed to list any Skills`)
}

export async function putSkill(skill: Skill) {
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: process.env.SKILL_TABLE,
      Item: {
        name: { S: skill.name },
        description: { S: skill.description },
        id: { S: skill.id },
      },
    }),
  )
}

export async function getSkill(id: Uuid): Promise<Skill> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.SKILL_TABLE,
      Key: { id: { S: id } },
    }),
  )

  const item = output.Item
  if (item) {
    return itemToSkill(item)
  }

  throw new NotFoundError(`Skill with id: ${id} not found`)
}

export async function getSkills(ids: Uuid[]): Promise<Skill[]> {
  const skills: Skill[] = []
  for (const id of ids) {
    skills.push(await getSkill(id))
  }

  return skills
}

export async function skillExists(id: Uuid): Promise<boolean> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.SKILL_TABLE,
      Key: { id: { S: id } },
    }),
  )

  return !!output.Item
}

export async function deleteSkill(id: Uuid): Promise<Skill> {
  const output = await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: process.env.SKILL_TABLE,
      Key: { id: { S: id } },
      ReturnValues: 'ALL_OLD',
    }),
  )

  if (output.Attributes) {
    return itemToSkill(output.Attributes)
  }

  throw new NotFoundError(
    `Cannot delete Skill with id: ${id}, it does not exist`,
  )
}

function itemToSkill(item: { [key: string]: AttributeValue }): Skill {
  return new Skill(item.name.S, item.description.S, item.id.S!)
}
