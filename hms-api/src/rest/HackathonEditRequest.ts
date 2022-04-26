/* eslint-disable require-jsdoc */

class HackathonEditRequest {
  title: string;
  startDate: Date;
  endDate: Date;

  constructor(
      title: string,
      startDate: Date,
      endDate: Date,
  ) {
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static parse(body: string): HackathonEditRequest {
    const json = JSON.parse(body);
    return new HackathonEditRequest(
        json.title,
        new Date(json.startDate),
        new Date(json.endDate),
    );
  }
}

export default HackathonEditRequest;
