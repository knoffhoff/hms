import { edit } from '../../../src/handler/user/edit'
import Uuid, { uuid } from '../../../src/util/Uuid'
import * as userService from '../../../src/service/user-service'
import UserEditResponse from '../../../src/rest/user/UserEditResponse'
import NotFoundError from '../../../src/error/NotFoundError'
import UserEditRequest from '../../../src/rest/user/UserEditRequest'
import ValidationError from '../../../src/error/ValidationError'
import ValidationResult from '../../../src/error/ValidationResult'

const mockEditUser = jest.spyOn(userService, 'editUser').mockImplementation()

describe('Edit User', () => {
  const lastName = 'McLasty'
  const firstName = 'First'
  const skills = [uuid()]
  const imageUrl = 'www.anywhere.com/image.png'
  const id = uuid()

  test('Happy Path', async () => {
    const callback = jest.fn()

    mockEditUser.mockImplementation()

    await edit(
      toEvent(lastName, firstName, skills, imageUrl, id),
      null,
      callback,
    )

    expect(mockEditUser).toHaveBeenCalledWith(
      id,
      lastName,
      firstName,
      skills,
      imageUrl,
    )
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new UserEditResponse(id)),
    })
  })

  test('Throws NotFoundError', async () => {
    const callback = jest.fn()
    const errorMessage = 'Where is it????'

    mockEditUser.mockImplementation(() => {
      throw new NotFoundError(errorMessage)
    })

    await edit(
      toEvent(lastName, firstName, skills, imageUrl, id),
      null,
      callback,
    )

    expect(mockEditUser).toHaveBeenCalledWith(
      id,
      lastName,
      firstName,
      skills,
      imageUrl,
    )
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

    mockEditUser.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult())
    })

    await edit(
      toEvent(lastName, firstName, skills, imageUrl, id),
      null,
      callback,
    )

    expect(mockEditUser).toHaveBeenCalledWith(
      id,
      lastName,
      firstName,
      skills,
      imageUrl,
    )
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

    mockEditUser.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await edit(
      toEvent(lastName, firstName, skills, imageUrl, id),
      null,
      callback,
    )

    expect(mockEditUser).toHaveBeenCalledWith(
      id,
      lastName,
      firstName,
      skills,
      imageUrl,
    )
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

const toEvent = (
  lastName: string,
  firstName: string,
  skills: Uuid[],
  imageUrl: string,
  id: Uuid,
): object => ({
  body: JSON.stringify(
    new UserEditRequest(lastName, firstName, skills, imageUrl),
  ),
  pathParameters: {
    id: id,
  },
})
