import {uuid, Uuid} from '../../util/uuids';

/**
 * A Skill is any technical or other kind of skill that a User has and is
 * needed for the completion of an Idea
 */
export default class {
  id: Uuid;
  name: string;
  description: string;

  constructor(
      name: string,
      description: string,
  );
  constructor(
      name: string,
      description: string,
      id: Uuid,
  );

  // eslint-disable-next-line require-jsdoc
  constructor(
      name: string,
      description: string,
      id: Uuid = uuid(),
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
