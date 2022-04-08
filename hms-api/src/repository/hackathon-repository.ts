/* eslint-disable require-jsdoc */
// TODO add error handling
// TODO add paging for lists

import Hackathon from './domain/Hackathon';
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {Uuid} from '../util/uuids';
import {getClient, safeTransformArray} from './dynamo-db';

const tableName = process.env.HACKATHON_TABLE_NAME;
const dynamoDBClient = getClient();

export async function listHackathons(): Promise<Hackathon[]> {
  const output = await dynamoDBClient.send(new ScanCommand({
    TableName: tableName,
  }));

  return output.Items.map((item) => itemToHackathon(item));
}

export async function createHackathon(hackathon: Hackathon) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: tableName,
    Item: {
      title: {S: hackathon.title},
      startDate: {S: hackathon.startDate.toString()},
      endDate: {S: hackathon.endDate.toString()},
      id: {S: hackathon.id},
      creationDate: {S: hackathon.creationDate.toString()},
      participants: safeTransformArray(hackathon.participantIds),
      categories: safeTransformArray(hackathon.categoryIds),
      ideas: safeTransformArray(hackathon.ideaIds),
    },
  }));
}

export async function getHackathon(id: Uuid): Promise<Hackathon | undefined> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: tableName,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  return item ? itemToHackathon(item) : undefined;
}

export async function removeHackathon(id: Uuid) {
  // TODO determine if something was actually deleted
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: tableName,
    Key: {id: {S: id}},
  }));
}

function itemToHackathon(item: { [key: string]: AttributeValue }): Hackathon {
  return new Hackathon(
      item.title.S,
      new Date(item.startDate.S),
      new Date(item.endDate.S),
      item.id.S,
      new Date(item.creationDate.S),
      item.participants.SS,
      item.categories.SS,
      item.ideas.SS,
  );
}
