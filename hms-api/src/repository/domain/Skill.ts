/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';

/**
 * A Skill is any technical or other kind of skill that a User has and is
 * needed for the completion of an Idea
 */
class Skill {
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

export default Skill;
