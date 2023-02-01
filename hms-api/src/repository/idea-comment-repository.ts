import {getClient} from './dynamo-db';
import Uuid from '../util/Uuid';
import {
  AttributeValue,
  DeleteItemCommand,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import NotFoundError from '../error/NotFoundError';
import IdeaComment from './domain/IdeaComment';
import ideaComment from './domain/IdeaComment';

const dynamoDbClient = getClient();

export async function listIdeaComments(ideaId: Uuid): Promise<IdeaComment[]> {
  const output = await dynamoDbClient.send(
    new QueryCommand({
      TableName: process.env.IDEA_COMMENT_TABLE,
      IndexName: process.env.IDEA_COMMENT_BY_IDEA_ID_INDEX,
      KeyConditionExpression: 'ideaId = :iId',
      ExpressionAttributeValues: {':iId': {S: ideaId}},
    }),
  );

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToIdeaComment(item));
  }

  throw new NotFoundError(`Comments for Idea with id: ${ideaId} not found`);
}

export async function putIdeaComment(ideaComment: IdeaComment): Promise<void> {
  await dynamoDbClient.send(
    new PutItemCommand({
      TableName: process.env.IDEA_COMMENT_TABLE,
      Item: {
        id: {S: ideaComment.id},
        userId: {S: ideaComment.userId},
        ideaId: {S: ideaComment.ideaId},
        text: {S: ideaComment.text},
        creationDate: {S: ideaComment.creationDate.toISOString()},
        parentIdeaCommentId: {S: ideaComment.parentIdeaCommentId},
      },
    }),
  );
}

export async function getIdeaComment(id: Uuid): Promise<IdeaComment> {
  const output = await dynamoDbClient.send(
    new GetItemCommand({
      TableName: process.env.IDEA_COMMENT_TABLE,
      Key: {id: {S: id}},
    }),
  );

  const item = output.Item;
  if (item) {
    return itemToIdeaComment(item);
  }

  throw new NotFoundError(`Comment with id: ${id} not found`);
}

export async function getIdeaComments(ids: Uuid[]): Promise<IdeaComment[]> {
  const ideaComments: IdeaComment[] = [];
  for (const id of ids) {
    ideaComments.push(await getIdeaComment(id));
  }
  return ideaComments;
}

export async function deleteIdeaComment(id: Uuid): Promise<IdeaComment> {
  const ouput = await dynamoDbClient.send(
    new DeleteItemCommand({
      TableName: process.env.IDEA_COMMENT_TABLE,
      Key: {id: {S: id}},
      ReturnValues: 'ALL_OLD',
    }),
  );

  if (ouput.Attributes) {
    return itemToIdeaComment(ouput.Attributes);
  }

  throw new NotFoundError(`Comment with id: ${id} not found`);
}

export async function ideaCommentAlreadyExists(
  ideaComment: ideaComment,
): Promise<boolean> {
  const output = await dynamoDbClient.send(
    new QueryCommand({
      TableName: process.env.IDEA_COMMENT_TABLE,
      IndexName: process.env.IDEA_COMMENT_BY_IDEA_ID_INDEX,
      KeyConditionExpression: 'ideaId = :iId',
      ExpressionAttributeValues: {':iId': {S: ideaComment.ideaId}},
    }),
  );

  const items = output.Items;
  return Array.isArray(items) && items.length > 0;
}

export async function parentCommentIdIdeaExists(
  parentCommentId: string,
): Promise<boolean> {
  const output = await dynamoDbClient.send(
    new QueryCommand({
      TableName: process.env.IDEA_COMMENT_TABLE,
      IndexName: process.env.IDEA_COMMENT_BY_IDEA_ID_INDEX,
      KeyConditionExpression: 'parentCommentId = :iId',
      ExpressionAttributeValues: {':iId': {S: parentCommentId}},
    }),
  );

  const items = output.Items;
  return Array.isArray(items) && items.length > 0;
}

function itemToIdeaComment(item: {[key: string]: AttributeValue}): IdeaComment {
  return new IdeaComment(
    item.userId.S,
    item.ideaId.S,
    item.text.S,
    item.id.S,
    new Date(item.creationDate.S!),
    item.parentIdeaCommentId.S,
  );
}
