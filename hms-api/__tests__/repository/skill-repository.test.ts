import {mockGetItem, mockGetItemOnce, mockQuery} from './dynamo-db-mock';
import {
  getSkill,
  getSkills,
  listSkills,
} from '../../src/repository/skill-repository';
import {uuid} from '../../src/util/uuids';
import NotFoundError from '../../src/repository/error/NotFoundError';
import {randomSkill} from './domain/skill-maker';
import Skill from '../../src/repository/domain/Skill';
import {AttributeValue} from '@aws-sdk/client-dynamodb';

describe('Get Skill', () => {
  test('Skill doesn\'t exist', async () => {
    const id = uuid();
    mockGetItem(null);

    await expect(getSkill(id)).rejects.toThrow(NotFoundError);
  });

  test('Skill exists', async () => {
    const expected = randomSkill();
    mockGetItem(itemFromSkill(expected));

    expect(await getSkill(expected.id)).toStrictEqual(expected);
  });
});

describe('Get Skills', () => {
  test('All skills missing', async () => {
    mockGetItemOnce(null);
    mockGetItemOnce(null);
    await expect(getSkills([uuid(), uuid()]))
        .rejects
        .toThrow(NotFoundError);
  });

  test('1 skill missing', async () => {
    const skill1 = randomSkill();
    mockGetItemOnce(itemFromSkill(skill1));
    mockGetItemOnce(null);
    await expect(getSkills([skill1.id, uuid()]))
        .rejects
        .toThrow(NotFoundError);
  });

  test('0 skills missing', async () => {
    const skill1 = randomSkill();
    mockGetItemOnce(itemFromSkill(skill1));
    const skill2 = randomSkill();
    mockGetItemOnce(itemFromSkill(skill2));
    expect(await getSkills([skill1.id, skill2.id]))
        .toStrictEqual([skill1, skill2]);
  });
});

describe('List Skills', () => {
  test('Query returns null', async () => {
    mockQuery(null);

    await expect(listSkills()).rejects.toThrow(NotFoundError);
  });

  test('0 Skills exist', async () => {
    mockQuery([]);

    expect(await listSkills()).toStrictEqual([]);
  });

  test('1 Skill exists', async () => {
    const skill = randomSkill();
    mockQuery([itemFromSkill(skill)]);

    expect(await listSkills()).toStrictEqual([skill]);
  });

  test('2 Skills exist', async () => {
    const skill1 = randomSkill();
    const skill2 = randomSkill();
    mockQuery([
      itemFromSkill(skill1),
      itemFromSkill(skill2),
    ]);

    expect(await listSkills()).toStrictEqual([skill1, skill2]);
  });
});

const itemFromSkill = (skill: Skill): { [key: string]: AttributeValue } => ({
  id: {S: skill.id},
  name: {S: skill.name},
  description: {S: skill.description},
});
