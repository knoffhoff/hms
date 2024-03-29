import { edit } from '../../../src/handler/category/edit'
import Uuid, { uuid } from '../../../src/util/Uuid'
import * as categoryService from '../../../src/service/category-service'
import CategoryEditResponse from '../../../src/rest/category/CategoryEditResponse'
import NotFoundError from '../../../src/error/NotFoundError'
import CategoryEditRequest from '../../../src/rest/category/CategoryEditRequest'
import ValidationError from '../../../src/error/ValidationError'
import ValidationResult from '../../../src/error/ValidationResult'

const mockEditCategory = jest
  .spyOn(categoryService, 'editCategory')
  .mockImplementation()

describe('Edit Category', () => {
  const title = 'New fancy title'
  const description = 'Well this is awkward'
  const id = uuid()

  test('Happy Path', async () => {
    const callback = jest.fn()

    mockEditCategory.mockImplementation()

    await edit(toEvent(title, description, id), null, callback)

    expect(mockEditCategory).toHaveBeenCalledWith(id, title, description)
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new CategoryEditResponse(id)),
    })
  })

  test('Throws NotFoundError', async () => {
    const callback = jest.fn()
    const errorMessage = 'Where is it????'

    mockEditCategory.mockImplementation(() => {
      throw new NotFoundError(errorMessage)
    })

    await edit(toEvent(title, description, id), null, callback)

    expect(mockEditCategory).toHaveBeenCalledWith(id, title, description)
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

  test('Throws ValidationError', async () => {
    const callback = jest.fn()
    const errorMessage = 'validation error message'

    mockEditCategory.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult())
    })

    await edit(toEvent(title, description, id), null, callback)

    expect(mockEditCategory).toHaveBeenCalledWith(id, title, description)
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
    const callback = jest.fn()
    const errorMessage = 'Boring old error'

    mockEditCategory.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await edit(toEvent(title, description, id), null, callback)

    expect(mockEditCategory).toHaveBeenCalledWith(id, title, description)
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

const toEvent = (title: string, description: string, id: Uuid): object => ({
  body: JSON.stringify(new CategoryEditRequest(title, description)),
  pathParameters: {
    id: id,
  },
})
