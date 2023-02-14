/* eslint-disable require-jsdoc */

class HackathonCreateRequest {
  title: string;
  description: string;
  slug: string;
  startDate: Date;
  endDate: Date;

  constructor(
    title: string,
    description: string,
    slug: string,
    startDate: Date,
    endDate: Date,
  ) {
    this.title = title;
    this.description = description;
    this.slug = slug;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static parse(body: string): HackathonCreateRequest {
    const json = JSON.parse(body);
    return new HackathonCreateRequest(
      json.title,
      json.description,
      json.slug,
      new Date(json.startDate),
      new Date(json.endDate),
    );
  }
}

export default HackathonCreateRequest;
