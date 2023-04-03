import Uuid, { uuid } from '../../../src/util/Uuid'
import Category from '../../../src/repository/domain/Category'

export interface CategoryData {
  id: Uuid;
  title: string;
  description: string;
  hackathonId: Uuid;
}

export const makeCategory = (
  {
    id = uuid(),
    title = 'Fancy Hats',
    description = 'Anything you wanna build so long as it is a fancy hat',
    hackathonId = uuid(),
  }: CategoryData): Category => new Category(
  title,
  description,
  hackathonId,
  id,
)

export const randomCategory = ()
  : Category => makeCategory({} as CategoryData)
