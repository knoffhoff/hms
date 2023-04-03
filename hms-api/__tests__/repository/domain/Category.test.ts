import { CategoryData, makeCategory, randomCategory } from './category-maker'

describe('Category Validation', () => {
  it.each([
    ['Happy Path', randomCategory(), false],
    ['Null ID', makeCategory({ id: null } as CategoryData), true],
    ['Empty ID', makeCategory({ id: '' } as CategoryData), true],
    ['Null Title', makeCategory({ title: null } as CategoryData), true],
    ['Empty Title', makeCategory({ title: '' } as CategoryData), true],
    ['Null Description',
      makeCategory({ description: null } as CategoryData),
      true],
    ['Empty Description',
      makeCategory({ description: '' } as CategoryData),
      false],
    ['Null Hackathon ID',
      makeCategory({ hackathonId: null } as CategoryData),
      true],
    ['Empty Hackathon ID',
      makeCategory({ hackathonId: '' } as CategoryData),
      true],
  ])('%s', (testName, category, failed) => {
    expect(category.validate().hasFailed()).toBe(failed)
  })
})
