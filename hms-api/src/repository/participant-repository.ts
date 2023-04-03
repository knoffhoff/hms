/* eslint-disable require-jsdoc */
// TODO add paging for lists

import { getClient } from './dynamo-db'
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import Uuid from '../util/Uuid'
import Participant from './domain/Participant'
import NotFoundError from '../error/NotFoundError'
import InvalidStateError from '../error/InvalidStateError'

const dynamoDBClient = getClient()

export async function listParticipants(
  hackathonId: Uuid,
): Promise<Participant[]> {
  const output = await dynamoDBClient.send(
    new QueryCommand({
      TableName: process.env.PARTICIPANT_TABLE,
      IndexName: process.env.PARTICIPANT_BY_HACKATHON_ID_INDEX,
      KeyConditionExpression: 'hackathonId = :hId',
      ExpressionAttributeValues: { ':hId': { S: hackathonId } },
    }),
  )

  const items = output.Items
  if (items) {
    return items.map((item) => itemToParticipant(item))
  }

  throw new NotFoundError(
    `Participants for Hackathon with id: ${hackathonId} not found`,
  )
}

export async function putParticipant(participant: Participant): Promise<void> {
  if (await participantAlreadyExists(participant)) {
    throw new InvalidStateError(
      'Cannot create Participant for ' +
      `User with id: ${participant.userId} and ` +
      `Hackathon with id: ${participant.hackathonId}, it already exists`,
    )
  }

  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: process.env.PARTICIPANT_TABLE,
      Item: {
        userId: { S: participant.userId },
        hackathonId: { S: participant.hackathonId },
        id: { S: participant.id },
        creationDate: { S: participant.creationDate.toISOString() },
      },
    }),
  )
}

export async function getParticipant(id: Uuid): Promise<Participant> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.PARTICIPANT_TABLE,
      Key: { id: { S: id } },
    }),
  )

  const item = output.Item
  if (item) {
    return itemToParticipant(item)
  }

  throw new NotFoundError(`Participant with id: ${id} not found`)
}

export async function getParticipants(ids: Uuid[]): Promise<Participant[]> {
  const participants: Participant[] = []
  for (const id of ids) {
    participants.push(await getParticipant(id))
  }
  return participants
}

export async function participantAlreadyExists(
  participant: Participant,
): Promise<boolean> {
  const output = await dynamoDBClient.send(
    new QueryCommand({
      TableName: process.env.PARTICIPANT_TABLE,
      IndexName: process.env.PARTICIPANT_BY_HACKATHON_ID_USER_ID_INDEX,
      KeyConditionExpression: 'hackathonId = :hId AND userId = :uId',
      ExpressionAttributeValues: {
        ':hId': { S: participant.hackathonId },
        ':uId': { S: participant.userId },
      },
    }),
  )

  const items = output.Items
  return Array.isArray(items) && items.length > 0
}

export async function participantExistsForHackathon(
  id: Uuid,
  hackathonId: Uuid,
): Promise<boolean> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.PARTICIPANT_TABLE,
      Key: { id: { S: id } },
    }),
  )

  return (
    !!output.Item &&
    output.Item.hackathonId &&
    output.Item.hackathonId.S === hackathonId
  )
}

export async function deleteParticipant(id: Uuid): Promise<Participant> {
  const output = await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: process.env.PARTICIPANT_TABLE,
      Key: { id: { S: id } },
      ReturnValues: 'ALL_OLD',
    }),
  )

  if (output.Attributes) {
    return itemToParticipant(output.Attributes)
  }

  throw new NotFoundError(
    `Cannot delete Participant with id: ${id}, it does not exist`,
  )
}

function itemToParticipant(item: { [key: string]: AttributeValue }): Participant {
  return new Participant(
    item.userId.S,
    item.hackathonId.S,
    item.id.S!,
    new Date(item.creationDate.S!),
  )
}
