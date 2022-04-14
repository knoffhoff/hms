/* eslint-disable require-jsdoc */
// TODO add paging for lists

import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import {Uuid} from '../util/uuids';
import {getClient} from './dynamo-db';
import Participant from './domain/Participant';
import NotFoundError from './error/NotFoundError';

const table = process.env.PARTICIPANT_TABLE;
const byHackathonIdIndex = process.env.PARTICIPANT_BY_HACKATHON_ID_INDEX;
const dynamoDBClient = getClient();

export async function listParticipants(
    hackathonId: Uuid,
): Promise<Participant[]> {
  const output = await dynamoDBClient.send(new QueryCommand({
    TableName: table,
    IndexName: byHackathonIdIndex,
    KeyConditionExpression: 'hackathonId = :hId',
    ExpressionAttributeValues: {':hId': {'S': hackathonId}},
  }));

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToParticipant(item));
  }

  throw new NotFoundError(
      `Participants for Hackathon with id: ${hackathonId} not found`);
}

export async function putParticipant(participant: Participant) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: table,
    Item: {
      userId: {S: participant.userId},
      hackathonId: {S: participant.hackathonId},
      id: {S: participant.id},
      creationDate: {S: participant.creationDate.toISOString()},
    },
  }));
}

export async function getParticipant(id: Uuid): Promise<Participant> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  if (item) {
    return itemToParticipant(item);
  }

  throw new NotFoundError(`Participant with id: ${id} not found`);
}

export async function getParticipants(ids: Uuid[]): Promise<Participant[]> {
  const participants: Participant[] = [];
  for (const id of ids) {
    participants.push(await getParticipant(id));
  }
  return participants;
}

export async function participantExists(id: Uuid): Promise<boolean> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  return !!output.Item;
}

export async function removeParticipant(id: Uuid) {
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));
}

function itemToParticipant(item: { [key: string]: AttributeValue })
    : Participant {
  return new Participant(
      item.userId.S,
      item.hackathonId.S,
      item.id.S!,
      new Date(item.creationDate.S!),
  );
}
