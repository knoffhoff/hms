/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import Hackathon from '../repository/domain/Hackathon';

class HackathonPreviewResponse {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;

  constructor(
      id: Uuid,
      title: string,
      startDate: Date,
      endDate: Date,
  ) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static from = (
      hackathon: Hackathon,
  ): HackathonPreviewResponse => new HackathonPreviewResponse(
      hackathon.id,
      hackathon.title,
      hackathon.startDate,
      hackathon.endDate,
  );

  static fromArray(hackathons: Hackathon[]): HackathonPreviewResponse[] {
    const previews: HackathonPreviewResponse[] = [];
    for (const hackathon of hackathons) {
      previews.push(HackathonPreviewResponse.from(hackathon));
    }
    return previews.sort(this.compare);
  }

  static compare(
      a: HackathonPreviewResponse,
      b: HackathonPreviewResponse,
  ): number {
    const aTime = a.startDate.getTime();
    const bTime = b.startDate.getTime();

    if (aTime === bTime) {
      return a.id.localeCompare(b.id);
    }

    return aTime - bTime;
  }
}

export default HackathonPreviewResponse;
