/* eslint-disable require-jsdoc */

import * as dynamoDb from '../../src/repository/dynamo-db';
import {
  AttributeValue,
  DeleteItemCommandOutput,
  DynamoDBClient,
  GetItemCommandOutput,
  PutItemCommandOutput,
  QueryCommandOutput,
  ScanCommandOutput,
} from '@aws-sdk/client-dynamodb';

export const categoryTable = 'category-table';
process.env.CATEGORY_TABLE = categoryTable;

export const categoryByHackathonIdIndex = 'category-by-hid-index';
process.env.CATEGORY_BY_HACKATHON_ID_INDEX = categoryByHackathonIdIndex;

export const hackathonTable = 'hackathon-table';
process.env.HACKATHON_TABLE = hackathonTable;

export const ideaTable = 'idea-table';
process.env.IDEA_TABLE = ideaTable;

export const ideaByHackathonIdIndex = 'idea-by-hid-index';
process.env.IDEA_BY_HACKATHON_ID_INDEX = ideaByHackathonIdIndex;

export const ideaByCategoryIdIndex = 'idea-by-cid-index';
process.env.IDEA_BY_CATEGORY_ID_INDEX = ideaByCategoryIdIndex;

export const ideaByOwnerIdIndex = 'idea-by-oid-index';
process.env.IDEA_BY_OWNER_ID_INDEX = ideaByOwnerIdIndex;

export const participantTable = 'participant-table';
process.env.PARTICIPANT_TABLE = participantTable;

export const participantByHackathonIdIndex = 'participant-by-hid-index';
process.env.PARTICIPANT_BY_HACKATHON_ID_INDEX = participantByHackathonIdIndex;

export const skillTable = 'skill-table';
process.env.SKILL_TABLE = skillTable;

export const userTable = 'user-table';
process.env.USER_TABLE = userTable;

export const mockSend = jest.fn();
beforeEach(mockSend.mockReset);

jest.spyOn(dynamoDb, 'getClient').mockImplementation(() => {
  return {
    send: mockSend,
  } as unknown as DynamoDBClient;
});

export function mockGetItem(item: { [key: string]: AttributeValue }): void {
  mockSend.mockResolvedValue({Item: item} as GetItemCommandOutput);
}

export function mockGetItemOnce(item: { [key: string]: AttributeValue }): void {
  mockSend.mockResolvedValueOnce({Item: item} as GetItemCommandOutput);
}

export function mockScan(items: { [key: string]: AttributeValue }[]): void {
  mockSend.mockResolvedValue({Items: items} as ScanCommandOutput);
}

export function mockQuery(items: { [key: string]: AttributeValue }[]): void {
  mockSend.mockResolvedValue({Items: items} as QueryCommandOutput);
}

export function mockQueryOnce(
    items: { [key: string]: AttributeValue }[],
): void {
  mockSend.mockResolvedValueOnce({Items: items} as QueryCommandOutput);
}

export function mockPutItem(): void {
  mockSend.mockResolvedValue({} as PutItemCommandOutput);
}

export function mockPutItemOnce(): void {
  mockSend.mockResolvedValueOnce({} as PutItemCommandOutput);
}

export function mockDeleteItem(
    attributes: { [key: string]: AttributeValue },
): void {
  mockSend.mockResolvedValue(
      {Attributes: attributes} as DeleteItemCommandOutput);
}
