/**
 * A Skill is any technical or other kind of skill that a User has and is
 * needed for the completion of an Idea
 */
export class Skill {
  name: string;
  description: string;

  // eslint-disable-next-line require-jsdoc
  constructor(
      name: string,
      description: string,
  ) {
    this.name = name;
    this.description = description;
  }
}
