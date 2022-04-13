/* eslint-disable require-jsdoc */

import {hackathonExists} from '../repository/hackathon-repository';
import {putCategory} from '../repository/category-repository';
import {Uuid} from '../util/uuids';
import Category from '../repository/domain/Category';
import ReferenceNotFoundError from '../repository/error/ReferenceNotFoundError';

export async function createCategory(
    title: string,
    description: string,
    hackathonId: Uuid,
) {
  if (!await hackathonExists(hackathonId)) {
    throw new ReferenceNotFoundError(`Cannot create category, ` +
        `Hackathon with id: ${hackathonId} does not exist`);
  }

  const category = new Category(title, description, hackathonId);
  await putCategory(category);
  return category;
}
