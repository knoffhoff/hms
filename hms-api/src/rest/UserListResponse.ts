/* eslint-disable require-jsdoc */

import {Uuid} from '../util/uuids';

export default class {
  ids: Uuid[];

  constructor(ids: Uuid[]) {
    this.ids = ids;
  }
}
