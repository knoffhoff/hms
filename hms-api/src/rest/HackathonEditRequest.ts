/* eslint-disable require-jsdoc */

class HackathonEditRequest {
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

  static parse(body: string): HackathonEditRequest {
    const json = JSON.parse(body);
    return new HackathonEditRequest(
        json.title,
        json.description,
        new Date(json.startDate),
        new Date(json.endDate),
    );
  }
}

export default HackathonEditRequest;
