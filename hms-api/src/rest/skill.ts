/* eslint-disable require-jsdoc */

export class CreateSkillRequest {
  name: string;
  description: string;

  constructor(
      name: string,
      description: string,
  ) {
    this.name = name;
    this.description = description;
  }
}

export class CreateSkillResponse {
  name: string;
  description: string;

  constructor(
      name: string,
      description: string,
  ) {
    this.name = name;
    this.description = description;
  }
}

export class SkillResponse {
  name: string;
  description: string;

  constructor(
      name: string,
      description: string,
  ) {
    this.name = name;
    this.description = description;
  }
}

export class SkillListResponse {
  names: string[];

  constructor(names: string[]) {
    this.names = names;
  }
}

export class SkillDeleteResponse {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
