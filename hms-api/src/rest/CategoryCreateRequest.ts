/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
  ) {
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }
}
