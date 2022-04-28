/* eslint-disable require-jsdoc */

class SkillEditRequest {
  name: string;
  description: string;

  constructor(
      name: string,
      description: string,
  ) {
    this.name = name;
    this.description = description;
  }

  static parse(body: string): SkillEditRequest {
    const json = JSON.parse(body);
    return new SkillEditRequest(
        json.name,
        json.description,
    );
  }
}

export default SkillEditRequest;
