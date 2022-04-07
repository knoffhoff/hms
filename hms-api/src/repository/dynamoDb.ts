'use strict';

/* eslint-disable require-jsdoc */
// TODO add error handling
// TODO add paging for lists

import {
  AttributeValue,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import {Hackathon} from './domain/Hackathon';
import {Uuid} from '../util/uuids';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  // TODO fix this ins some env var
  endpoint: 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4566',
});
const hackathonTable: string | undefined = process.env.HACKATHON_TABLE_NAME;

export async function getHackathons(): Promise<Hackathon[]> {
  const output = await client.send(new ScanCommand({
    TableName: hackathonTable,
  }));

  return output.Items.map((item) => itemToHackathon(item));
}

export async function createHackathon(hackathon: Hackathon) {
  await client.send(new PutItemCommand({
    TableName: hackathonTable,
    Item: {
      title: {S: hackathon.title},
      startDate: {S: hackathon.startDate.toString()},
      endDate: {S: hackathon.endDate.toString()},
      id: {S: hackathon.id},
      creationDate: {S: hackathon.creationDate.toString()},
      participants: nullOrEmpty(hackathon.participantIds),
      categories: nullOrEmpty(hackathon.categoryIds),
      ideas: nullOrEmpty(hackathon.ideaIds),
    },
  }));
}

export async function getHackathon(id: Uuid): Promise<Hackathon | undefined> {
  const output = await client.send(new GetItemCommand({
    TableName: hackathonTable,
    Key: {id: {S: id}},
  }));

  const item = output.Item;
  return item ? itemToHackathon(item) : undefined;
}

export async function removeHackathon(id: Uuid) {
  // TODO determine if something was actually deleted
  await client.send(new DeleteItemCommand({
    TableName: hackathonTable,
    Key: {id: {S: id}},
  }));
}

function itemToHackathon(item :{[key: string]: AttributeValue}): Hackathon {
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

function nullOrEmpty(a: string[]):
    AttributeValue.SSMember |
    AttributeValue.NULLMember {
  return a.length > 0 ? {SS: a} : {NULL: true};
}
