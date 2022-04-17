/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

export default class {
  id: Uuid;
  name: string;
  description: string;

  constructor(
      id: Uuid,
      name: string,
      description: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
