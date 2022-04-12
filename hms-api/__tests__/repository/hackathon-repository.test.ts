import {mockGetItem, mockQuery} from './dynamo-db-mock';
import {
  getHackathon,
  listHackathons,
} from '../../src/repository/hackathon-repository';
import {uuid} from '../../src/util/uuids';
import NotFoundException
  from '../../src/repository/exception/NotFoundException';
import {randomHackathon} from './domain/hackathon-maker';
import Hackathon from '../../src/repository/domain/Hackathon';
import {AttributeValue} from '@aws-sdk/client-dynamodb';

describe('Get Hackathon', () => {
  test('Hackathon doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getHackathon(id)).rejects.toThrow(NotFoundException);
  });

  test('Hackathon exists', async () => {
    const expected = randomHackathon();
    mockGetItem(itemFromHackathon(expected));

    expect(await getHackathon(expected.id)).toStrictEqual(expected);
  });
});

describe('List Hackathons', () => {
  test('Query returns null', async () => {
    mockQuery(null);

    await expect(listHackathons()).rejects.toThrow(NotFoundException);
  });

  test('0 Hackathons exist', async () => {
    mockQuery([]);

    expect(await listHackathons()).toStrictEqual([]);
  });

  test('1 Hackathon exists', async () => {
    const hackathon = randomHackathon();
    mockQuery([itemFromHackathon(hackathon)]);

    expect(await listHackathons()).toStrictEqual([hackathon]);
  });

  test('2 Hackathons exist', async () => {
    const hackathon1 = randomHackathon();
    const hackathon2 = randomHackathon();
    mockQuery([
      itemFromHackathon(hackathon1),
      itemFromHackathon(hackathon2),
    ]);

    expect(await listHackathons()).toStrictEqual([hackathon1, hackathon2]);
  });
});

const itemFromHackathon = (hackathon: Hackathon)
    : { [key: string]: AttributeValue } => ({
  id: {S: hackathon.id},
  title: {S: hackathon.title},
  startDate: {S: hackathon.startDate.toISOString()},
  endDate: {S: hackathon.endDate.toISOString()},
  creationDate: {S: hackathon.creationDate.toISOString()},
  participantIds: {SS: hackathon.participantIds},
  categoryIds: {SS: hackathon.categoryIds},
  ideaIds: {SS: hackathon.ideaIds},
});
