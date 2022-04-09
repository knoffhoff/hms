/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      id: Uuid,
      title: string,
      description: string,
      hackathonId: Uuid,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }
}
