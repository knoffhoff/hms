/* eslint-disable require-jsdoc */

import {
  getHackathon,
  hackathonExists,
} from '../repository/hackathon-repository';
import {
  deleteCategory,
  getCategory,
  listCategories,
  putCategory,
} from '../repository/category-repository';
import Uuid from '../util/Uuid';
import Category from '../repository/domain/Category';
import ReferenceNotFoundError from '../error/ReferenceNotFoundError';
import CategoryResponse from '../rest/Category/CategoryResponse';
import CategoryListResponse from '../rest/Category/CategoryListResponse';
import CategoryDeleteResponse from '../rest/Category/CategoryDeleteResponse';
import {removeIdeasForCategory} from './idea-service';
import NotFoundError from '../error/NotFoundError';
import DeletionError from '../error/DeletionError';
import ValidationError from '../error/ValidationError';

export async function createCategory(
  title: string,
  description: string,
  hackathonId: Uuid,
): Promise<Category> {
  if (!(await hackathonExists(hackathonId))) {
    throw new ReferenceNotFoundError(
      `Cannot create Category, ` +
        `Hackathon with id: ${hackathonId} does not exist`,
    );
  }

  const category = new Category(title, description, hackathonId);
  const result = category.validate();
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot create Category`, result);
  }

  await putCategory(category);
  return category;
}

export async function editCategory(
  id: Uuid,
  title: string,
  description: string,
): Promise<void> {
  let existing: Category;
  try {
    existing = await getCategory(id);
    existing.title = title;
    existing.description = description;
  } catch (e) {
    throw new NotFoundError(
      `Cannot edit Category with id: ${id}, it does not exist`,
    );
  }

  const result = existing.validate();
  if (result.hasFailed()) {
    throw new ValidationError(`Cannot edit Category with id ${id}`, result);
  }

  await putCategory(existing);
}

export async function getCategoryResponse(id: Uuid): Promise<CategoryResponse> {
  const category = await getCategory(id);

  let hackathon;
  try {
    hackathon = await getHackathon(category.hackathonId);
  } catch (e) {
    throw new ReferenceNotFoundError(
      `Cannot get Category with id: ${id}, ` +
        `reference Hackathon with id: ${category.hackathonId} does not exist`,
    );
  }

  return CategoryResponse.from(category, hackathon);
}

export async function getCategoryListResponse(
  hackathonId: Uuid,
): Promise<CategoryListResponse> {
  if (!(await hackathonExists(hackathonId))) {
    throw new NotFoundError(
      `Cannot list Categories for Hackathon with id: ${hackathonId}, ` +
        `it does not exist`,
    );
  }

  const categories = await listCategories(hackathonId);

  return CategoryListResponse.from(categories, hackathonId);
}

export async function removeCategory(
  id: Uuid,
): Promise<CategoryDeleteResponse> {
  try {
    await removeIdeasForCategory(id);
  } catch (e) {
    throw new DeletionError(
      `Unable to remove Category with id ${id}, ` +
        `nested failure is: ${e.message}`,
    );
  }

  await deleteCategory(id);
  return new CategoryDeleteResponse(id);
}

export async function removeCategoriesForHackathon(
  hackathonId: Uuid,
): Promise<void> {
  const categories = await listCategories(hackathonId);
  for (const category of categories) {
    await removeCategory(category.id);
  }
}
