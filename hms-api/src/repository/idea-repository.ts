/* eslint-disable require-jsdoc */
// TODO add paging for lists

import { getClient, safeTransformArray, safeTransformSSMember, } from './dynamo-db'
import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import Uuid from '../util/Uuid'
import Idea from './domain/Idea'
import NotFoundError from '../error/NotFoundError'

const dynamoDBClient: DynamoDBClient = getClient()

export async function listIdeasForHackathon(
  hackathonId: Uuid,
): Promise<Idea[]> {
  const output = await dynamoDBClient.send(
    new QueryCommand({
      TableName: process.env.IDEA_TABLE,
      IndexName: process.env.IDEA_BY_HACKATHON_ID_INDEX,
      KeyConditionExpression: 'hackathonId = :hId',
      ExpressionAttributeValues: { ':hId': { S: hackathonId } },
    }),
  )

  const items = output.Items
  if (items) {
    return items.map((item) => itemToIdea(item))
  }

  throw new NotFoundError(
    `Ideas for Hackathon with id: ${hackathonId} not found`,
  )
}

export async function listIdeasAll(): Promise<Idea[]> {
  const output = await dynamoDBClient.send(
    new ScanCommand({
      TableName: process.env.IDEA_TABLE,
    }),
  )

  const items = output.Items
  if (items) {
    return items.map((item) => itemToIdea(item))
  }

  throw new NotFoundError('No ideas found')
}

export async function listIdeasForCategory(categoryId: Uuid): Promise<Idea[]> {
  const output = await dynamoDBClient.send(
    new QueryCommand({
      TableName: process.env.IDEA_TABLE,
      IndexName: process.env.IDEA_BY_CATEGORY_ID_INDEX,
      KeyConditionExpression: 'categoryId = :cId',
      ExpressionAttributeValues: { ':cId': { S: categoryId } },
    }),
  )

  const items = output.Items
  if (items) {
    return items.map((item) => itemToIdea(item))
  }

  throw new NotFoundError(
    `Ideas for Category with id: ${categoryId} not found`,
  )
}

export async function listIdeasForParticipant(
  participantId: Uuid,
): Promise<Idea[]> {
  const output = await dynamoDBClient.send(
    new ScanCommand({
      TableName: process.env.IDEA_TABLE,
      FilterExpression: 'contains(participantIds, :pId)',
      ExpressionAttributeValues: { ':pId': { S: participantId } },
    }),
  )

  const items = output.Items
  if (items) {
    return items.map((item) => itemToIdea(item))
  }

  throw new NotFoundError(
    `Ideas for Participant with id: ${participantId} not found`,
  )
}

export async function listIdeasForOwner(ownerId: Uuid): Promise<Idea[]> {
  const output = await dynamoDBClient.send(
    new QueryCommand({
      TableName: process.env.IDEA_TABLE,
      IndexName: process.env.IDEA_BY_OWNER_ID_INDEX,
      KeyConditionExpression: 'ownerId = :oId',
      ExpressionAttributeValues: { ':oId': { S: ownerId } },
    }),
  )

  const items = output.Items
  if (items) {
    return items.map((item) => itemToIdea(item))
  }

  throw new NotFoundError(`Ideas for Owner with id: ${ownerId} not found`)
}

export async function putIdea(idea: Idea): Promise<void> {
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: process.env.IDEA_TABLE,
      Item: {
        ownerId: { S: idea.ownerId },
        hackathonId: { S: idea.hackathonId },
        participantIds: safeTransformArray(idea.participantIds),
        voterIds: safeTransformArray(idea.voterIds),
        title: { S: idea.title },
        description: { S: idea.description },
        problem: { S: idea.problem },
        goal: { S: idea.goal },
        requiredSkills: safeTransformArray(idea.requiredSkills),
        categoryId: { S: idea.categoryId },
        id: { S: idea.id },
        creationDate: { S: idea.creationDate.toISOString() },
      },
    }),
  )
}

export async function getIdea(id: Uuid): Promise<Idea> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.IDEA_TABLE,
      Key: { id: { S: id } },
    }),
  )

  const item = output.Item
  if (item) {
    return itemToIdea(item)
  }

  throw new NotFoundError(`Idea with id: ${id} not found`)
}

export async function ideaExists(id: Uuid): Promise<boolean> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.IDEA_TABLE,
      Key: { id: { S: id } },
    }),
  )
  return !!output.Item
}

export async function deleteIdea(id: Uuid): Promise<Idea> {
  const output = await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: process.env.IDEA_TABLE,
      Key: { id: { S: id } },
      ReturnValues: 'ALL_OLD',
    }),
  )

  if (output.Attributes) {
    return itemToIdea(output.Attributes)
  }

  throw new NotFoundError(
    `Cannot delete Idea with id ${id}, it does not exist`,
  )
}

export async function addParticipantToIdea(
  ideaId: Uuid,
  participantId: Uuid,
): Promise<void> {
  const idea = await getIdea(ideaId)
  if (!idea.participantIds.includes(participantId)) {
    idea.participantIds.push(participantId)
    await putIdea(idea)
  }
}

export async function addVoterToIdea(
  ideaId: Uuid,
  voterId: Uuid,
): Promise<void> {
  const idea = await getIdea(ideaId)
  if (!idea.voterIds.includes(voterId)) {
    idea.voterIds.push(voterId)
    await putIdea(idea)
  }
}

export async function deleteParticipantFromIdea(
  ideaId: Uuid,
  participantId: Uuid,
): Promise<void> {
  await dynamoDBClient.send(
    new UpdateItemCommand({
      TableName: process.env.IDEA_TABLE,
      Key: { id: { S: ideaId } },
      UpdateExpression: 'DELETE participantIds :participant_id',
      ExpressionAttributeValues: {
        ':participant_id': { SS: [participantId] },
      },
    }),
  )
}

export async function deleteVoterFromIdea(
  ideaId: Uuid,
  voterId: Uuid,
): Promise<void> {
  await dynamoDBClient.send(
    new UpdateItemCommand({
      TableName: process.env.IDEA_TABLE,
      Key: { id: { S: ideaId } },
      UpdateExpression: 'DELETE voterIds :voter_id',
      ExpressionAttributeValues: {
        ':voter_id': { SS: [voterId] },
      },
    }),
  )
}

function itemToIdea(item: { [key: string]: AttributeValue }): Idea {
  return new Idea(
    item.ownerId.S,
    item.hackathonId.S,
    item.title.S,
    item.description.S,
    item.problem.S,
    item.goal.S,
    safeTransformSSMember(item.requiredSkills),
    item.categoryId.S,
    item.id.S!,
    new Date(item.creationDate.S!),
    safeTransformSSMember(item.participantIds),
    safeTransformSSMember(item.voterIds),
  )
}
