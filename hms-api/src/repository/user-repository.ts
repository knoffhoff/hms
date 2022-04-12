/* eslint-disable require-jsdoc */
// TODO add error handling
// TODO add paging for lists

import User from './domain/User';
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {Uuid} from '../util/uuids';
import {getClient, safeTransformArray} from './dynamo-db';
import {mapRolesToStrings, mapStringToRoles} from './domain/Role';
import NotFoundException from './exception/NotFoundException';

const table = process.env.USER_TABLE;
const dynamoDBClient = getClient();

export async function listUsers(): Promise<User[]> {
  const output = await dynamoDBClient.send(new ScanCommand({
    TableName: table,
  }));

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToUser(item));
  }

  throw new NotFoundException(`Failed to list any users`);
}

export async function createUser(user: User) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: table,
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
  }));
}

export async function getUser(id: Uuid): Promise<User> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  if (item) {
    return itemToUser(item);
  }

  throw new NotFoundException(`User with id ${id} not found`);
}

export async function getUsers(ids: Uuid[]): Promise<User[]> {
  const users: User[] = [];
  for (const id of ids) {
    users.push(await getUser(id));
  }
  return users;
}

export async function removeUser(id: Uuid) {
  // TODO determine if something was actually deleted
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));
}

function itemToUser(item: { [key: string]: AttributeValue }): User {
  return new User(
      item.lastName.S,
      item.firstName.S,
      item.emailAddress.S,
      mapStringToRoles(item.roles.SS),
      item.skills.SS,
      item.imageUrl.S,
      item.id.S!,
      new Date(item.creationDate.S!),
  );
}
