import {mockGetItem, mockGetItemOnce, mockQuery} from './dynamo-db-mock';
import {
  getUser,
  getUsers,
  listUsers,
  userExists,
} from '../../src/repository/user-repository';
import {uuid} from '../../src/util/uuids';
import NotFoundError from '../../src/repository/error/NotFoundError';
import {randomUser} from './domain/user-maker';
import User from '../../src/repository/domain/User';
import {AttributeValue} from '@aws-sdk/client-dynamodb';
import {mapRolesToStrings} from '../../src/repository/domain/Role';

describe('Get User', () => {
  test('User doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getUser(id)).rejects.toThrow(NotFoundError);
  });

  test('User exists', async () => {
    const expected = randomUser();
    mockGetItem(itemFromUser(expected));

    expect(await getUser(expected.id)).toStrictEqual(expected);
  });
});

describe('Get Users', () => {
  test('All users missing', async () => {
    mockGetItemOnce(null);
    mockGetItemOnce(null);
    await expect(getUsers([uuid(), uuid()]))
        .rejects
        .toThrow(NotFoundError);
  });

  test('1 user missing', async () => {
    const user1 = randomUser();
    mockGetItemOnce(itemFromUser(user1));
    mockGetItemOnce(null);
    await expect(getUsers([user1.id, uuid()]))
        .rejects
        .toThrow(NotFoundError);
  });

  test('0 users missing', async () => {
    const user1 = randomUser();
    mockGetItemOnce(itemFromUser(user1));
    const user2 = randomUser();
    mockGetItemOnce(itemFromUser(user2));
    expect(await getUsers([user1.id, user2.id]))
        .toStrictEqual([user1, user2]);
  });
});

describe('List Users', () => {
  test('Query returns null', async () => {
    mockQuery(null);

    await expect(listUsers()).rejects.toThrow(NotFoundError);
  });

  test('0 Users exist', async () => {
    mockQuery([]);

    expect(await listUsers()).toStrictEqual([]);
  });

  test('1 User exists', async () => {
    const user = randomUser();
    mockQuery([itemFromUser(user)]);

    expect(await listUsers()).toStrictEqual([user]);
  });

  test('2 Users exist', async () => {
    const user1 = randomUser();
    const user2 = randomUser();
    mockQuery([
      itemFromUser(user1),
      itemFromUser(user2),
    ]);

    expect(await listUsers()).toStrictEqual([user1, user2]);
  });
});

describe('User Exists', () => {
  test('Item is non-null', async () => {
    mockGetItem({});

    expect(await userExists(uuid())).toBe(true);
  });

  test('Item is null', async () => {
    mockGetItem(null);

    expect(await userExists(uuid())).toBe(false);
  });
});

const itemFromUser = (user: User): { [key: string]: AttributeValue } => ({
  lastName: {S: user.lastName},
  firstName: {S: user.firstName},
  emailAddress: {S: user.emailAddress},
  roles: {SS: mapRolesToStrings(user.roles)},
  skills: {SS: user.skills},
  imageUrl: {S: user.imageUrl},
  id: {S: user.id},
  creationDate: {S: user.creationDate.toISOString()},
});
