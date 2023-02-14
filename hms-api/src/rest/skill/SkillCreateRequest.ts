/* eslint-disable require-jsdoc */

class SkillCreateRequest {
  name: string;
  description: string;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  static parse(body: string): SkillCreateRequest {
    const json = JSON.parse(body);
    return new SkillCreateRequest(json.name, json.description);
  }
}

export default SkillCreateRequest;
