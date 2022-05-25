/* eslint-disable require-jsdoc */

import Uuid from '../util/Uuid';

class SkillEditRequest {
  lastName: string;
  firstName: string;
  skills: Uuid[];
  imageUrl: string;

  constructor(
      lastName: string,
      firstName: string,
      skills: Uuid[],
      imageUrl: string,
  ) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.skills = skills;
    this.imageUrl = imageUrl;
  }

  static parse(body: string): SkillEditRequest {
    const json = JSON.parse(body);
    return new SkillEditRequest(
        json.lastName,
        json.firstName,
        json.skills,
        json.imageUrl,
    );
  }
}

export default SkillEditRequest;
