import {mockPut} from '../repository/dynamo-db-mock';
import {mockUuid} from '../util/uuids-mock';
import {randomSkill} from '../repository/domain/skill-maker';
import {createSkill} from '../../src/service/skill-service';

describe('Create Skill', () => {
  test('Happy Path', async () => {
    mockPut();

    const expected = randomSkill();
    mockUuid(expected.id);

    expect(await createSkill(
        expected.name,
        expected.description,
    )).toStrictEqual(expected);
  });
});
