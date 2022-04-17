/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';
import HackathonPreviewResponse from './HackathonPreviewResponse';

export default class {
  id: Uuid;
  title: string;
  description: string;
  hackathon: HackathonPreviewResponse;

  constructor(
      id: Uuid,
      title: string,
      description: string,
      hackathon: HackathonPreviewResponse,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hackathon = hackathon;
  }
}
