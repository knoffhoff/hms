import HackathonListResponse from '../../src/rest/HackathonListResponse';
import {
  HackathonData,
  makeHackathon,
} from '../repository/domain/hackathon-maker';
import HackathonPreviewResponse from '../../src/rest/HackathonPreviewResponse';

describe('Convert From', () => {
  test('Categories are sorted', () => {
    const hackathon1 = makeHackathon({startDate: new Date(0)} as HackathonData);
    const hackathon2 = makeHackathon({startDate: new Date(1)} as HackathonData);
    const hackathon3 = makeHackathon({startDate: new Date(2)} as HackathonData);

    const response = HackathonListResponse.from(
        [hackathon3, hackathon1, hackathon2],
    );

    expect(response).toEqual(new HackathonListResponse(
        [
          HackathonPreviewResponse.from(hackathon1),
          HackathonPreviewResponse.from(hackathon2),
          HackathonPreviewResponse.from(hackathon3),
        ],
    ));
  });
});
