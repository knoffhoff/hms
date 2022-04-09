/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  userId: Uuid;
  hackathonId: Uuid;

  constructor(
      userId: Uuid,
      hackathonId: Uuid,
  ) {
    this.userId = userId;
    this.hackathonId = hackathonId;
  }
}
