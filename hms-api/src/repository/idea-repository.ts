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
import {getClient, safeTransformArray} from './dynamo-db';
import Idea from './domain/Idea';
import NotFoundError from './error/NotFoundError';

const dynamoDBClient = getClient();

export async function listIdeas(hackathonId: Uuid): Promise<Idea[]> {
  const output = await dynamoDBClient.send(new QueryCommand({
    TableName: process.env.IDEA_TABLE,
    IndexName: process.env.IDEA_BY_HACKATHON_ID_INDEX,
    KeyConditionExpression: 'hackathonId = :hId',
    ExpressionAttributeValues: {':hId': {'S': hackathonId}},
  }));

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToIdea(item));
  }

  throw new NotFoundError(
      `Ideas for Hackathon with id: ${hackathonId} not found`);
}

export async function createIdea(idea: Idea) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: process.env.IDEA_TABLE,
    Item: {
      owner: {S: idea.ownerId},
      hackathonId: {S: idea.hackathonId},
      participantIds: safeTransformArray(idea.participantIds),
      title: {S: idea.title},
      description: {S: idea.description},
      problem: {S: idea.problem},
      goal: {S: idea.goal},
      requiredSkills: safeTransformArray(idea.requiredSkills),
      categoryId: {S: idea.categoryId},
      id: {S: idea.id},
      creationDate: {S: idea.creationDate.toISOString()},
    },
  }));
}

export async function getIdea(id: Uuid): Promise<Idea> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: process.env.IDEA_TABLE,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  if (item) {
    return itemToIdea(item);
  }

  throw new NotFoundError(`Idea with id: ${id} not found`);
}

export async function removeIdea(id: Uuid) {
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: process.env.IDEA_TABLE,
    Key: {id: {S: id}},
  }));
}

function itemToIdea(item: { [key: string]: AttributeValue }): Idea {
  return new Idea(
      item.ownerId.S,
      item.hackathonId.S,
      item.participantIds.SS,
      item.title.S,
      item.description.S,
      item.problem.S,
      item.goal.S,
      item.requiredSkills.SS,
      item.categoryId.S,
      item.id.S!,
      new Date(item.creationDate.S!),
  );
}
