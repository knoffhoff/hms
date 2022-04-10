/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  ids: Uuid[];
  hackathonId: Uuid;

  constructor(
      ids: Uuid[],
      hackathonId: Uuid,
  ) {
    this.ids = ids;
    this.hackathonId = hackathonId;
  }
}
