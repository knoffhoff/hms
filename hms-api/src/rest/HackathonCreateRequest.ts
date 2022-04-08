/* eslint-disable require-jsdoc */
export default class {
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
}
