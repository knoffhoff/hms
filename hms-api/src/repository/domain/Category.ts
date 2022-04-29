/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';

/**
 * Each Hackathon has a number of Categories and each Category has a number of
 * Ideas
 */
class Category {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;

  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
  );
  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
      id: Uuid,
  );

  constructor(
      title: string,
      description: string,
      hackathonId: Uuid,
      id: Uuid = uuid(),
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.hackathonId = hackathonId;
  }

  static compare(a: Category, b: Category): number {
    if (a.title === b.title) {
      return a.id.localeCompare(b.id);
    }

    return a.title.localeCompare(b.title);
  }
}

export default Category;
