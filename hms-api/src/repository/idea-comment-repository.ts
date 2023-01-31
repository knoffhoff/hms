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
import Comment from './domain/IdeaComment';
import ideaComment from './domain/IdeaComment';

const dynamoDbClient = getClient();

export async function listComments(ideaId: Uuid): Promise<Comment[]> {
  const output = await dynamoDbClient.send(
    new QueryCommand({
      TableName: process.env.COMMENT_TABLE,
      IndexName: process.env.COMMENT_BY_IDEA_ID_INDEX,
      KeyConditionExpression: 'ideaId = :iId',
      ExpressionAttributeValues: {':iId': {S: ideaId}},
    }),
  );

  const items = output.Items;
  if (items) {
    return items.map((item) => itemToComment(item));
  }

  throw new NotFoundError(`Comments for Idea with id: ${ideaId} not found`);
}

export async function putComment(comment: Comment): Promise<void> {
  await dynamoDbClient.send(
    new PutItemCommand({
      TableName: process.env.COMMENT_TABLE,
      Item: {
        id: {S: comment.id},
        userId: {S: comment.userId},
        ideaId: {S: comment.ideaId},
        text: {S: comment.text},
        replyTo: {S: comment.replyTo},
        creationDate: {S: comment.creationDate.toISOString()},
      },
    }),
  );
}

export async function getComment(id: Uuid): Promise<Comment> {
  const output = await dynamoDbClient.send(
    new GetItemCommand({
      TableName: process.env.COMMENT_TABLE,
      Key: {id: {S: id}},
    }),
  );

  const item = output.Item;
  if (item) {
    return itemToComment(item);
  }

  throw new NotFoundError(`Comment with id: ${id} not found`);
}

export async function getComments(ids: Uuid[]): Promise<Comment[]> {
  const comments: Comment[] = [];
  for (const id of ids) {
    comments.push(await getComment(id));
  }
  return comments;
}

export async function deleteComment(id: Uuid): Promise<Comment> {
  const ouput = await dynamoDbClient.send(
    new DeleteItemCommand({
      TableName: process.env.COMMENT_TABLE,
      Key: {id: {S: id}},
      ReturnValues: 'ALL_OLD',
    }),
  );

  if (ouput.Attributes) {
    return itemToComment(ouput.Attributes);
  }

  throw new NotFoundError(`Comment with id: ${id} not found`);
}

export async function commentAlreadyExists(
  ideaComment: ideaComment,
): Promise<boolean> {
  const output = await dynamoDbClient.send(
    new QueryCommand({
      TableName: process.env.COMMENT_TABLE,
      IndexName: process.env.COMMENT_BY_IDEA_ID_INDEX,
      KeyConditionExpression: 'ideaId = :iId',
      ExpressionAttributeValues: {':iId': {S: ideaComment.ideaId}},
    }),
  );

  const items = output.Items;
  return Array.isArray(items) && items.length > 0;
}

function itemToComment(item: {[key: string]: AttributeValue}): Comment {
  return new Comment(
    item.userId.S,
    item.ideaId.S,
    item.text.S,
    item.replyTo.S,
    item.id.S,
    new Date(item.creationDate.S!),
  );
}
