/* eslint-disable require-jsdoc */
// TODO add paging for lists

import User from './domain/User';
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import Uuid from '../util/Uuid';
import {
  getClient,
  safeTransformArray,
  safeTransformSSMember,
} from './dynamo-db';
import {mapRolesToStrings, mapStringToRoles} from './domain/Role';
import NotFoundError from '../error/NotFoundError';

const dynamoDBClient = getClient();

export async function listUsers(): Promise<User[]> {
  const output = await dynamoDBClient.send(
    new ScanCommand({
      TableName: process.env.USER_TABLE,
    }),
  );

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToUser(item));
  }

  throw new NotFoundError(`Failed to list any users`);
}

export async function putUser(user: User) {
  await dynamoDBClient.send(
    new PutItemCommand({
      TableName: process.env.USER_TABLE,
      Item: {
        lastName: {S: user.lastName},
        firstName: {S: user.firstName},
        emailAddress: {S: user.emailAddress},
        roles: safeTransformArray(mapRolesToStrings(user.roles)),
        skills: safeTransformArray(user.skills),
        imageUrl: {S: user.imageUrl},
        id: {S: user.id},
        creationDate: {S: user.creationDate.toISOString()},
      },
    }),
  );
}

export async function getUser(id: Uuid): Promise<User> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.USER_TABLE,
      Key: {id: {S: id}},
    }),
  );

  const item = output.Item;
  if (item) {
    return itemToUser(item);
  }

  throw new NotFoundError(`User with id ${id} not found`);
}

export async function getUsers(ids: Uuid[]): Promise<User[]> {
  const users: User[] = [];
  for (const id of ids) {
    users.push(await getUser(id));
  }
  return users;
}

export async function userExists(id: Uuid): Promise<boolean> {
  const output = await dynamoDBClient.send(
    new GetItemCommand({
      TableName: process.env.USER_TABLE,
      Key: {id: {S: id}},
    }),
  );

  return !!output.Item;
}

export async function userExistsByEmail(
  emailAddress: string,
): Promise<boolean> {
  const output = await dynamoDBClient.send(
    new QueryCommand({
      TableName: process.env.USER_TABLE,
      IndexName: process.env.USER_BY_EMAIL_ADDRESS_INDEX,
      KeyConditionExpression: 'emailAddress = :ea',
      ExpressionAttributeValues: {':ea': {S: emailAddress}},
    }),
  );

  const items = output.Items;
  return Array.isArray(items) && items.length > 0;
}

export async function deleteUser(id: Uuid) {
  const output = await dynamoDBClient.send(
    new DeleteItemCommand({
      TableName: process.env.USER_TABLE,
      Key: {id: {S: id}},
      ReturnValues: 'ALL_OLD',
    }),
  );

  if (output.Attributes) {
    return itemToUser(output.Attributes);
  }

  throw new NotFoundError(
    `Cannot delete User with id: ${id}, ` + `it does not exist`,
  );
}

function itemToUser(item: {[key: string]: AttributeValue}): User {
  return new User(
    item.lastName.S,
    item.firstName.S,
    item.emailAddress.S,
    mapStringToRoles(safeTransformSSMember(item.roles)),
    safeTransformSSMember(item.skills),
    item.imageUrl.S,
    item.id.S!,
    new Date(item.creationDate.S!),
  );
}
