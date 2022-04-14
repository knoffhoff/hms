import {mockPut} from '../repository/dynamo-db-mock';
import {mockUuid} from '../util/uuids-mock';
import {randomHackathon} from '../repository/domain/hackathon-maker';
import {createHackathon} from '../../src/service/hackathon-service';
import {mockDate} from '../util/date-mock';

describe('Create Hackathon', () => {
  test('Happy Path', async () => {
    mockPut();
    mockDate();

    const expected = randomHackathon();
    mockUuid(expected.id);

    expect(await createHackathon(
        expected.title,
        expected.startDate,
        expected.endDate,
    )).toStrictEqual(expected);
  });
});
