/* eslint-disable require-jsdoc */

import Uuid from '../../util/Uuid';
import Hackathon from '../../repository/domain/Hackathon';

class HackathonPreviewResponse {
  id: Uuid;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  votingOpened: boolean;

  constructor(
    id: Uuid,
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    votingOpened: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.votingOpened = votingOpened;
  }

  static from = (hackathon: Hackathon): HackathonPreviewResponse =>
    new HackathonPreviewResponse(
      hackathon.id,
      hackathon.title,
      hackathon.description,
      hackathon.startDate,
      hackathon.endDate,
      hackathon.votingOpened,
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
    let diff = a.startDate.getTime() - b.startDate.getTime();

    if (diff) {
      return diff;
    }

    diff = a.endDate.getTime() - b.endDate.getTime();

    if (diff) {
      return diff;
    }

    return a.id.localeCompare(b.id);
  }
}

export default HackathonPreviewResponse;
