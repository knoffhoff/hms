/* eslint-disable require-jsdoc */

import HackathonPreviewResponse from './HackathonPreviewResponse';

export default class {
  hackathons: HackathonPreviewResponse[];

  constructor(hackathons: HackathonPreviewResponse[]) {
    this.hackathons = hackathons;
  }
}
