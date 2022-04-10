/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  id: Uuid;
  userId: Uuid;
  hackathonId: Uuid;
  creationDate: Date;

  constructor(
      id: Uuid,
      userId: Uuid,
      hackathonId: Uuid,
      creationDate: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.hackathonId = hackathonId;
    this.creationDate = creationDate;
  }
}
