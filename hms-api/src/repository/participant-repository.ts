/* eslint-disable require-jsdoc */
// TODO add error handling
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

const table = process.env.PARTICIPANT_TABLE;
const byHackathonIdIndex = process.env.PARTICIPANT_BY_HACKATHON_ID_INDEX;
const dynamoDBClient = getClient();

export async function listParticipants(hackathonId: Uuid)
    : Promise<Participant[]> {
  const output = await dynamoDBClient.send(new QueryCommand({
    TableName: table,
    IndexName: byHackathonIdIndex,
    KeyConditionExpression: 'hackathonId = :hId',
    ExpressionAttributeValues: {':hId': {'S': hackathonId}},
  }));

  return output.Items!.map((item) => itemToParticipant(item));
}

export async function createParticipant(participant: Participant) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: table,
    Item: {
      userId: {S: participant.userId},
      hackathonId: {S: participant.hackathonId},
      id: {S: participant.id},
      creationDate: {S: participant.creationDate.toString()},
    },
  }));
}

export async function getParticipant(id: Uuid): Promise<Participant> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  return itemToParticipant(output.Item!);
}

export async function getParticipants(ids: Uuid[]): Promise<Participant[]> {
  const participants: Participant[] = [];
  for (const id of ids) {
    participants.push(await getParticipant(id));
  }
  return participants;
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
      item.userId.S!,
      item.hackathonId.S!,
      item.id.S!,
      new Date(item.creationDate.S!),
  );
}
