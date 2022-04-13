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
import Category from './domain/Category';
import NotFoundError from './error/NotFoundError';

const table = process.env.CATEGORY_TABLE;
const byHackathonIdIndex = process.env.CATEGORY_BY_HACKATHON_ID_INDEX;
const dynamoDBClient = getClient();

export async function listCategories(hackathonId: Uuid): Promise<Category[]> {
  const output = await dynamoDBClient.send(new QueryCommand({
    TableName: table,
    IndexName: byHackathonIdIndex,
    KeyConditionExpression: 'hackathonId = :hId',
    ExpressionAttributeValues: {':hId': {'S': hackathonId}},
  }));

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToCategory(item));
  }

  throw new NotFoundError(
      `Categories for Hackathon with id: ${hackathonId} not found`);
}

export async function createCategory(category: Category) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: table,
    Item: {
      title: {S: category.title},
      description: {S: category.description},
      hackathonId: {S: category.hackathonId},
      id: {S: category.id},
    },
  }));
}

export async function getCategory(id: Uuid): Promise<Category> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  if (item) {
    return itemToCategory(item);
  }

  throw new NotFoundError(`Category with id: ${id} not found`);
}

export async function removeCategory(id: Uuid) {
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));
}

function itemToCategory(item: { [key: string]: AttributeValue }): Category {
  return new Category(
      item.title.S,
      item.description.S,
      item.hackathonId.S,
      item.id.S!,
  );
}
