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
import CategoryResponse from '../rest/CategoryResponse';
import CategoryListResponse from '../rest/CategoryListResponse';
import CategoryDeleteResponse from '../rest/CategoryDeleteResponse';
import {removeIdeasForCategory} from './idea-service';
import NotFoundError from '../error/NotFoundError';

export async function createCategory(
    title: string,
    description: string,
    hackathonId: Uuid,
): Promise<Category> {
  if (!await hackathonExists(hackathonId)) {
    throw new ReferenceNotFoundError(`Cannot create Category, ` +
        `Hackathon with id: ${hackathonId} does not exist`);
  }

  const category = new Category(title, description, hackathonId);
  await putCategory(category);
  return category;
}

export async function editCategory(
    id: Uuid,
    title: string,
    description: string,
): Promise<void> {
  try {
    const existing = await getCategory(id);
    existing.title = title;
    existing.description = description;

    await putCategory(existing);
  } catch (e) {
    throw new NotFoundError(`Cannot edit Category with id: ${id}, ` +
        `it does not exist`);
  }
}

export async function getCategoryResponse(id: Uuid): Promise<CategoryResponse> {
  const category = await getCategory(id);

  let hackathon;
  try {
    hackathon = await getHackathon(category.hackathonId);
  } catch (e) {
    throw new ReferenceNotFoundError(`Cannot get Category with id: ${id}, ` +
        `reference Hackathon with id: ${category.hackathonId} does not exist`);
  }

  return CategoryResponse.from(category, hackathon);
}

export async function getCategoryListResponse(
    hackathonId: Uuid,
): Promise<CategoryListResponse> {
  const categories = await listCategories(hackathonId);
  return CategoryListResponse.from(categories, hackathonId);
}

export async function removeCategory(
    id: Uuid,
): Promise<CategoryDeleteResponse> {
  try {
    await removeIdeasForCategory(id);
  } catch (e) {
    // TODO throw an error
  }

  await deleteCategory(id);
  return new CategoryDeleteResponse(id);
}
