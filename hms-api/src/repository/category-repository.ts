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
import Category from './domain/Category';

const tableName = process.env.CATEGORY_TABLE_NAME;
const byHackathonIdIndexName = process.env.CATEGORY_BY_HACKATHON_ID_INDEX_NAME;
const dynamoDBClient = getClient();

export async function listCategories(hackathonId: Uuid): Promise<Category[]> {
  const output = await dynamoDBClient.send(new QueryCommand({
    TableName: tableName,
    IndexName: byHackathonIdIndexName,
    KeyConditionExpression: 'hackathonId = :hId',
    ExpressionAttributeValues: {':hId': {'S': hackathonId}},
  }));

  return output.Items.map((item) => itemToCategory(item));
}

export async function createCategory(category: Category) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: tableName,
    Item: {
      title: {S: category.title},
      description: {S: category.description},
      hackathonId: {S: category.hackathonId},
      id: {S: category.id},
    },
  }));
}

export async function getCategory(id: Uuid): Promise<Category | undefined> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: tableName,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  return item ? itemToCategory(item) : undefined;
}

export async function removeCategory(id: Uuid) {
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: tableName,
    Key: {id: {S: id}},
  }));
}

function itemToCategory(item: { [key: string]: AttributeValue }): Category {
  return new Category(
      item.title.S,
      item.description.S,
      item.hackathonId.S,
      item.id.S,
  );
}
