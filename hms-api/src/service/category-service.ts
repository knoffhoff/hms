/* eslint-disable require-jsdoc */

import {hackathonExists} from '../repository/hackathon-repository';
import {deleteCategory, putCategory} from '../repository/category-repository';
import Uuid from '../util/Uuid';
import Category from '../repository/domain/Category';
import ReferenceNotFoundError from '../repository/error/ReferenceNotFoundError';

export async function createCategory(
    title: string,
    description: string,
    hackathonId: Uuid,
) {
  if (!await hackathonExists(hackathonId)) {
    throw new ReferenceNotFoundError(`Cannot create Category, ` +
        `Hackathon with id: ${hackathonId} does not exist`);
  }

  const category = new Category(title, description, hackathonId);
  await putCategory(category);
  return category;
}

export async function removeCategory(id: Uuid) {
  await deleteCategory(id);
}
