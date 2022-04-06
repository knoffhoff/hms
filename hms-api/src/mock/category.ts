import {Uuid} from '../uuids';
import {CategoryListResponse, CategoryResponse} from '../rest/category';
import {currHackathonId, nextHackathonId, prevHackathonId} from './hackathon';

export const prevCategoryId1 = '7f38993d-073a-4932-af79-07440012f268';
export const prevCategory1 = new CategoryResponse(
    prevCategoryId1,
    'Bears and Bees',
    'Just cool bears and bee focused projects',
    prevHackathonId,
);

export const prevCategoryId2 = 'a8ce5468-ec97-4b99-acea-511c54817956';
export const prevCategory2 = new CategoryResponse(
    prevCategoryId2,
    'Tech stuff',
    'Generic tech stuff projects',
    prevHackathonId,
);

export const prevCategoryIds = [
  prevCategoryId1,
  prevCategoryId2,
];

export const currCategoryId1 = '52c0bbde-6360-451c-bf50-b56694f56053';
export const currCategory1 = new CategoryResponse(
    currCategoryId1,
    'All in one bucket',
    'Just a single category for everything in this hackathon',
    currHackathonId,
);

export const currCategoryIds = [currCategoryId1];

export const nextCategoryId1 = 'e499b34e-fda9-4f66-949a-46e0300b9d08';
export const nextCategory1 = new CategoryResponse(
    nextCategoryId1,
    'Another fun category',
    'For just fun stuff, you know like shoes and knives',
    nextHackathonId,
);

export const nextCategoryId2 = 'c9897c51-2e0b-47d7-b9a7-5572e990d02b';
export const nextCategory2 = new CategoryResponse(
    nextCategoryId2,
    'An even BETTER category',
    'Filling out this information really takes a long time',
    nextHackathonId,
);

export const nextCategoryId3 = '4be5c953-b871-40e3-b0cc-d2a7c929b519';
export const nextCategory3 = new CategoryResponse(
    nextCategoryId3,
    'A pretty bland category',
    'Oh good it\'s the category to write a description for',
    nextHackathonId,
);

export const nextCategoryIds = [
  nextCategoryId1,
  nextCategoryId2,
  nextCategoryId3,
];

// eslint-disable-next-line require-jsdoc
export function getCategories(hackathonId: Uuid): CategoryListResponse {
  switch (hackathonId) {
    case prevHackathonId:
      return new CategoryListResponse(prevCategoryIds, hackathonId);
    case currHackathonId:
      return new CategoryListResponse(currCategoryIds, hackathonId);
    case nextHackathonId:
      return new CategoryListResponse(nextCategoryIds, hackathonId);
    default:
      return null;
  }
}

// eslint-disable-next-line require-jsdoc
export function getCategory(id: Uuid): CategoryResponse {
  switch (id) {
    case prevCategoryId1: return prevCategory1;
    case prevCategoryId2: return prevCategory2;
    case currCategoryId1: return currCategory1;
    case nextCategoryId1: return nextCategory1;
    case nextCategoryId2: return nextCategory2;
    case nextCategoryId3: return nextCategory3;
    default: return null;
  }
}
