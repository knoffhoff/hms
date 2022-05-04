/* eslint-disable require-jsdoc */

import HackathonPreviewResponse from './HackathonPreviewResponse';
import Hackathon from '../repository/domain/Hackathon';

class HackathonListResponse {
  hackathons: HackathonPreviewResponse[];

  constructor(hackathons: HackathonPreviewResponse[]) {
    this.hackathons = hackathons;
  }

  static from = (
      hackathons: Hackathon[],
  ): HackathonListResponse => new HackathonListResponse(
      HackathonPreviewResponse.fromArray(hackathons),
  );
}

export default HackathonListResponse;
