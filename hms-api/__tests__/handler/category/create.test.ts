import * as categoryService from '../../../src/service/category-service'
import { create } from '../../../src/handler/category/create'
import { randomCategory } from '../../repository/domain/category-maker'
import CategoryCreateResponse from '../../../src/rest/category/CategoryCreateResponse'
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError'
import Category from '../../../src/repository/domain/Category'
import CategoryCreateRequest from '../../../src/rest/category/CategoryCreateRequest'
import ValidationError from '../../../src/error/ValidationError'
import ValidationResult from '../../../src/error/ValidationResult'

const mockCreateCategory = jest
  .spyOn(categoryService, 'createCategory')
  .mockImplementation()

describe('Create Category', () => {
  test('Happy Path', async () => {
    const expected = randomCategory()
    const event = toEvent(expected)
    const callback = jest.fn()

    mockCreateCategory.mockResolvedValueOnce(expected)

    await create(event, null, callback)

    expect(mockCreateCategory).toHaveBeenCalledWith(
      expected.title,
      expected.description,
      expected.hackathonId,
    )
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new CategoryCreateResponse(expected.id)),
    })
  })

  test('Throws ReferenceNotFoundError', async () => {
    const errorMessage = 'reference error message'
    const callback = jest.fn()

    mockCreateCategory.mockImplementation(() => {
      throw new ReferenceNotFoundError(errorMessage)
    })

    await create(toEvent(randomCategory()), null, callback)

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

  test('Throws ValidationError', async () => {
    const errorMessage = 'validation error message'
    const callback = jest.fn()

    mockCreateCategory.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult())
    })

    await create(toEvent(randomCategory()), null, callback)

    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 422,
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

    mockCreateCategory.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await create(toEvent(randomCategory()), null, callback)

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

const toEvent = (category: Category): object => ({
  body: JSON.stringify(
    new CategoryCreateRequest(
      category.title,
      category.description,
      category.hackathonId,
    ),
  ),
})
