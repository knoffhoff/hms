/* eslint-disable require-jsdoc */
// TODO add paging for lists

import Hackathon from './domain/Hackathon';
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import Uuid from '../util/Uuid';
import {getClient} from './dynamo-db';
import NotFoundError from '../error/NotFoundError';

const table = process.env.HACKATHON_TABLE;
const dynamoDBClient = getClient();

export async function listHackathons(): Promise<Hackathon[]> {
  const output = await dynamoDBClient.send(
    new ScanCommand({
      TableName: table,
    }),
  );

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToHackathon(item));
  }

  throw new NotFoundError(`Failed to list any Hackathons`);
}

export async function putHackathon(hackathon: Hackathon) {
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: table,
      Item: {
        title: {S: hackathon.title},
        description: {S: hackathon.description},
        startDate: {S: hackathon.startDate.toISOString()},
        endDate: {S: hackathon.endDate.toISOString()},
        id: {S: hackathon.id},
        creationDate: {S: hackathon.creationDate.toISOString()},
      },
    }),
  );
}

export async function getHackathon(id: Uuid): Promise<Hackathon> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: table,
      Key: {id: {S: id}},
    }),
  );

  const item = output.Item;
  if (item) {
    return itemToHackathon(item);
  }

  throw new NotFoundError(`Hackathon with id: ${id} not found`);
}

export async function hackathonExists(id: Uuid): Promise<boolean> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: table,
      Key: {id: {S: id}},
    }),
  );

  return !!output.Item;
}

export async function deleteHackathon(id: Uuid) {
  const output = await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: table,
      Key: {id: {S: id}},
      ReturnValues: 'ALL_OLD',
    }),
  );

  if (output.Attributes) {
    return itemToHackathon(output.Attributes);
  }

  throw new NotFoundError(
    `Cannot delete Hackathon with id: ${id}, it does not exist`,
  );
}

function itemToHackathon(item: {[key: string]: AttributeValue}): Hackathon {
  return new Hackathon(
    item.title.S,
    item.description.S,
    new Date(item.startDate.S),
    new Date(item.endDate.S),
    item.id.S!,
    new Date(item.creationDate.S!),
  );
}
