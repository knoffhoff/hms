/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import Hackathon from '../repository/domain/Hackathon';

class HackathonPreviewResponse {
  id: Uuid;
  title: string;

  constructor(
      id: Uuid,
      title: string,
  ) {
    this.id = id;
    this.title = title;
  }

  static from = (
      hackathon: Hackathon,
  ): HackathonPreviewResponse => new HackathonPreviewResponse(
      hackathon.id,
      hackathon.title,
  );

  static fromArray(hackathons: Hackathon[]): HackathonPreviewResponse[] {
    const previews: HackathonPreviewResponse[] = [];
    for (const hackathon of hackathons) {
      previews.push(HackathonPreviewResponse.from(hackathon));
    }
    return previews;
  }
}

export default HackathonPreviewResponse;
