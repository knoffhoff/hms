/* eslint-disable require-jsdoc */

class HackathonCreateRequest {
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

  static parse(body: string): HackathonCreateRequest {
    const json = JSON.parse(body);
    return new HackathonCreateRequest(
        json.title,
        new Date(json.startDate),
        new Date(json.endDate),
    );
  }
}

export default HackathonCreateRequest;
