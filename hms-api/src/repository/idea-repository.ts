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
import {getClient, safeTransformArray} from './dynamo-db';
import Idea from './domain/Idea';

const table = process.env.IDEA_TABLE;
const byHackathonIdIndex = process.env.IDEA_BY_HACKATHON_ID_INDEX;
const dynamoDBClient = getClient();

export async function listIdeas(hackathonId: Uuid): Promise<Idea[]> {
  const output = await dynamoDBClient.send(new QueryCommand({
    TableName: table,
    IndexName: byHackathonIdIndex,
    KeyConditionExpression: 'hackathonId = :hId',
    ExpressionAttributeValues: {':hId': {'S': hackathonId}},
  }));

  return output.Items.map((item) => itemToIdea(item));
}

export async function createIdea(idea: Idea) {
  await dynamoDBClient.send(new PutItemCommand({
    TableName: table,
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
      creationDate: {S: idea.creationDate.toString()},
    },
  }));
}

export async function getIdea(id: Uuid): Promise<Idea | undefined> {
  const output = await dynamoDBClient.send(new GetItemCommand({
    TableName: table,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  return item ? itemToIdea(item) : undefined;
}

export async function removeIdea(id: Uuid) {
  await dynamoDBClient.send(new DeleteItemCommand({
    TableName: table,
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
      item.id.S,
      new Date(item.creationDate.S),
  );
}
