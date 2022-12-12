/* eslint-disable require-jsdoc */

class HackathonEditRequest {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  votingOpened: boolean;

  constructor(
    title: string,
    description: string,
    startDate: Date,
    endDate: Date,
    votingOpened: boolean,
  ) {
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.votingOpened = votingOpened;
  }

  static parse(body: string): HackathonEditRequest {
    const json = JSON.parse(body);
    return new HackathonEditRequest(
      json.title,
      json.description,
      new Date(json.startDate),
      new Date(json.endDate),
      json.votingOpened,
    );
  }
}

export default HackathonEditRequest;
