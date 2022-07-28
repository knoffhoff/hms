/* eslint-disable require-jsdoc */

import Uuid, {uuid} from '../../util/Uuid';
import ValidationResult from '../../error/ValidationResult';

/**
 * A Category is meant to group a number of Ideas for a Hackathon into a group
 *
 * Every Category will belong to 1 and only 1 Hackathon
 *
 * Every Category will have 0 or more Ideas
 */
class Category {
  /**
   * The ID of the category
   *
   * Generated upon creation
   */
  id: Uuid;

  /**
   * Title of the Category
   *
   * Must have text (cannot be empty)
   */
  title: string;

  /**
   * The description of the Category
   *
   * May be empty
   */
  description: string;

  /**
   * The ID of the Hackathon to which the Category belongs
   */
  hackathonId: Uuid;

  validate(): ValidationResult {
    const result = new ValidationResult();
    if (!this.id) {
      result.addFailure('id is null or empty');
    }

    if (!this.title) {
      result.addFailure('title is null or empty');
    }

    if (this.description === null || this.description === undefined) {
      result.addFailure('description is null');
    }

    if (!this.hackathonId) {
      result.addFailure('hackathonId is null or empty');
    }
    return result;
  }

  constructor(title: string, description: string, hackathonId: Uuid);
  constructor(title: string, description: string, hackathonId: Uuid, id: Uuid);

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
}

export default Category;
