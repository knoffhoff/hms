import {mockGetItem, mockQuery} from './dynamo-db-mock';
import {getIdea, listIdeas} from '../../src/repository/idea-repository';
import {uuid} from '../../src/util/uuids';
import NotFoundException
  from '../../src/repository/exception/NotFoundException';
import {IdeaData, makeIdea, randomIdea} from './domain/idea-maker';
import Idea from '../../src/repository/domain/Idea';
import {AttributeValue} from '@aws-sdk/client-dynamodb';

const table = 'idea-table';
process.env.IDEA_TABLE = table;

const byHackathonIdIndex = 'idea-table-index';
process.env.IDEA_BY_HACKATHON_ID_INDEX = byHackathonIdIndex;

describe('Get Idea', () => {
  test('Idea doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getIdea(id)).rejects.toThrow(NotFoundException);
  });

  test('Idea exists', async () => {
    const expected = randomIdea();
    mockGetItem(itemFromIdea(expected));

    expect(await getIdea(expected.id)).toStrictEqual(expected);
  });
});

describe('List Ideas', () => {
  test('Query returns null', async () => {
    const hackathonId = uuid();
    mockQuery(null);

    await expect(listIdeas(hackathonId))
        .rejects
        .toThrow(NotFoundException);
  });

  test('0 Ideas exist', async () => {
    const hackathonId = uuid();
    mockQuery([]);

    expect(await listIdeas(hackathonId)).toStrictEqual([]);
  });

  test('1 Idea exists', async () => {
    const hackathonId = uuid();
    const idea = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockQuery([itemFromIdea(idea)]);

    expect(await listIdeas(hackathonId)).toStrictEqual([idea]);
  });

  test('2 Ideas exist', async () => {
    const hackathonId = uuid();
    const idea1 = makeIdea({hackathonId: hackathonId} as IdeaData);
    const idea2 = makeIdea({hackathonId: hackathonId} as IdeaData);
    mockQuery([itemFromIdea(idea1), itemFromIdea(idea2)]);

    expect(await listIdeas(hackathonId)).toStrictEqual([idea1, idea2]);
  });
});

const itemFromIdea = (idea: Idea): { [key: string]: AttributeValue } => ({
  id: {S: idea.id},
  ownerId: {S: idea.ownerId},
  hackathonId: {S: idea.hackathonId},
  participantIds: {SS: idea.participantIds},
  title: {S: idea.title},
  description: {S: idea.description},
  problem: {S: idea.problem},
  goal: {S: idea.goal},
  requiredSkills: {SS: idea.requiredSkills},
  categoryId: {S: idea.categoryId},
  creationDate: {S: idea.creationDate.toISOString()},
});
