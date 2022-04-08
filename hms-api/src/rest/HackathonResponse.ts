/* eslint-disable require-jsdoc */
import {Uuid} from '../util/uuids';

export default class {
  id: Uuid;
  title: string;
  startDate: Date;
  endDate: Date;
  creationDate: Date;
  // Just going to set all of these as Uuids for right now
  participantIds: Uuid[];
  categoryIds: Uuid[];
  ideaIds: Uuid[];

  constructor(
      id: Uuid,
      title: string,
      startDate: Date,
      endDate: Date,
      participantIds: Uuid[],
      categoryIds: Uuid[],
      ideaIds: Uuid[],
  ) {
    this.id = id;
    this.title = title;
    this.startDate = startDate;
    this.endDate = endDate;
    this.participantIds = participantIds;
    this.categoryIds = categoryIds;
    this.ideaIds = ideaIds;
  }
}
