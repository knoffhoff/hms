import { randomCategory } from '../../repository/domain/category-maker'
import { get } from '../../../src/handler/category/get'
import NotFoundError from '../../../src/error/NotFoundError'
import * as categoryService from '../../../src/service/category-service'
import Uuid, { uuid } from '../../../src/util/Uuid'
import { randomHackathon } from '../../repository/domain/hackathon-maker'
import CategoryResponse from '../../../src/rest/category/CategoryResponse'
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError'

const mockGetCategory = jest
  .spyOn(categoryService, 'getCategoryResponse')
  .mockImplementation()

describe('Get Category', () => {
  test('Happy Path', async () => {
    const category = randomCategory()
    const expected = CategoryResponse.from(category, randomHackathon())
    const event = toEvent(category.id)
    const callback = jest.fn()

    mockGetCategory.mockResolvedValueOnce(expected)

    await get(event, null, callback)

    expect(mockGetCategory).toHaveBeenCalledWith(category.id)
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(expected),
    })
  })

  test('Throws NotFoundError', async () => {
    const errorMessage = 'reference error message'
    const callback = jest.fn()

    mockGetCategory.mockImplementation(() => {
      throw new NotFoundError(errorMessage)
    })

    await get(toEvent(uuid()), null, callback)

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ errorMessage: errorMessage }),
    })
  })

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message'
    const callback = jest.fn()

    mockGetCategory.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage)
    })

    await get(toEvent(uuid()), null, callback)

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ errorMessage: errorMessage }),
    })
  })

  test('Throws Error', async () => {
    const errorMessage = 'generic error message'
    const callback = jest.fn()

    mockGetCategory.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await get(toEvent(uuid()), null, callback)

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ errorMessage: errorMessage }),
    })
  })
})

const toEvent = (id: Uuid): object => ({
  pathParameters: {
    id: id,
  },
})
