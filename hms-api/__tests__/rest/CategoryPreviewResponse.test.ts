import { CategoryData, makeCategory } from '../repository/domain/category-maker'
import CategoryPreviewResponse from '../../src/rest/category/CategoryPreviewResponse'

describe('Compare', () => {
  test('All values different', () => {
    const a = CategoryPreviewResponse.from(
      makeCategory({ title: 'a' } as CategoryData),
    )
    const b = CategoryPreviewResponse.from(
      makeCategory({ title: 'b' } as CategoryData),
    )

    expect(CategoryPreviewResponse.compare(a, b)).toBeLessThan(0)
    expect(CategoryPreviewResponse.compare(b, a)).toBeGreaterThan(0)
  })

  test('Same titles', () => {
    const a = CategoryPreviewResponse.from(
      makeCategory({
        id: 'a',
        title: 'a',
      } as CategoryData),
    )
    const b = CategoryPreviewResponse.from(
      makeCategory({
        id: 'b',
        title: 'a',
      } as CategoryData),
    )

    expect(CategoryPreviewResponse.compare(a, b)).toBeLessThan(0)
    expect(CategoryPreviewResponse.compare(b, a)).toBeGreaterThan(0)
  })

  test('All values same', () => {
    const a = CategoryPreviewResponse.from(
      makeCategory({ id: 'a' } as CategoryData),
    )
    const b = CategoryPreviewResponse.from(
      makeCategory({ id: 'a' } as CategoryData),
    )

    expect(CategoryPreviewResponse.compare(a, b)).toBe(0)
    expect(CategoryPreviewResponse.compare(b, a)).toBe(0)
  })
})
