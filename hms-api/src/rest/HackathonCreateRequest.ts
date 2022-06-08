/* eslint-disable require-jsdoc */

class HackathonCreateRequest {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;

  constructor(
      title: string,
      description: string,
      startDate: Date,
      endDate: Date,
  ) {
    this.title = title;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static parse(body: string): HackathonCreateRequest {
    const json = JSON.parse(body);
    return new HackathonCreateRequest(
        json.title,
        json.description,
        new Date(json.startDate),
        new Date(json.endDate),
    );
  }
}

export default HackathonCreateRequest;
