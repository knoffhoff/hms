import {mockPutItem} from '../repository/dynamo-db-mock';
import {mockUuid} from '../util/uuids-mock';
import {randomHackathon} from '../repository/domain/hackathon-maker';
import {
  createHackathon,
  removeHackathon
} from '../../src/service/hackathon-service';
import {mockDate} from '../util/date-mock';
import {uuid} from '../../src/util/Uuid';
import * as hackathonRepository
  from '../../src/repository/hackathon-repository';

const mockPutHackathon = jest.fn();
jest.spyOn(hackathonRepository, 'putHackathon')
    .mockImplementation(mockPutHackathon);
const mockDeleteHackathon = jest.fn();
jest.spyOn(hackathonRepository, 'deleteHackathon')
    .mockImplementation(mockDeleteHackathon);

describe('Create Hackathon', () => {
  test('Happy Path', async () => {
    mockPutItem();
    mockDate();

    const expected = randomHackathon();
    mockUuid(expected.id);

    expect(await createHackathon(
        expected.title,
        expected.startDate,
        expected.endDate,
    )).toStrictEqual(expected);

    expect(mockPutHackathon).toHaveBeenCalledWith(expected);
  });
});

describe('Delete Hackathon', () => {
  test('Happy Path', async () => {
    const id = uuid();
    await removeHackathon(id);
    expect(mockDeleteHackathon).toHaveBeenCalledWith(id);
  });
});
