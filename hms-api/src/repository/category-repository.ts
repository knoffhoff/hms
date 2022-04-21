/* eslint-disable require-jsdoc */
// TODO add paging for lists

import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import Uuid from '../util/Uuid';
import {getClient} from './dynamo-db';
import Category from './domain/Category';
import NotFoundError from '../error/NotFoundError';

const dynamoDBClient = getClient();

export async function listCategories(hackathonId: Uuid): Promise<Category[]> {
  const output = await dynamoDBClient.send(new QueryCommand({
    TableName: process.env.CATEGORY_TABLE,
    IndexName: process.env.CATEGORY_BY_HACKATHON_ID_INDEX,
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

export async function putCategory(category: Category) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: process.env.CATEGORY_TABLE,
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
    TableName: process.env.CATEGORY_TABLE,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  if (item) {
    return itemToCategory(item);
  }

  throw new NotFoundError(`Category with id: ${id} not found`);
}

export async function categoryExists(id: Uuid): Promise<boolean> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: process.env.CATEGORY_TABLE,
    Key: {id: {S: id}},
  }));

  return !!output.Item;
}

export async function deleteCategory(id: Uuid): Promise<Category> {
  const output = await dynamoDBClient.send(new DeleteItemCommand({
    TableName: process.env.CATEGORY_TABLE,
    Key: {id: {S: id}},
    ReturnValues: 'ALL_OLD',
  }));

  if (output.Attributes) {
    return itemToCategory(output.Attributes);
  }

  throw new NotFoundError(`Cannot delete Category with id: ${id}, ` +
      `it does not exist`);
}

function itemToCategory(item: { [key: string]: AttributeValue }): Category {
  return new Category(
      item.title.S,
      item.description.S,
      item.hackathonId.S,
      item.id.S!,
  );
}
