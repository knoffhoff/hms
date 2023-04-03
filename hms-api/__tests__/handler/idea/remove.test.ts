import * as ideaService from '../../../src/service/idea-service'
import { remove } from '../../../src/handler/idea/remove'
import IdeaDeleteResponse from '../../../src/rest/idea/IdeaDeleteResponse'
import Uuid, { uuid } from '../../../src/util/Uuid'
import DeletionError from '../../../src/error/DeletionError'

const mockRemoveIdea = jest
  .spyOn(ideaService, 'removeIdea')
  .mockImplementation()

describe('Delete Idea', () => {
  test('Happy Path', async () => {
    const id = uuid()
    const event = toEvent(id)
    const callback = jest.fn()

    mockRemoveIdea.mockResolvedValueOnce(new IdeaDeleteResponse(id))

    await remove(event, null, callback)

    expect(mockRemoveIdea).toHaveBeenCalledWith(id)
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaDeleteResponse(id)),
    })
  })

  test('Throws DeletionError', async () => {
    const errorMessage = 'deletion error message'
    const callback = jest.fn()

    mockRemoveIdea.mockImplementation(() => {
      throw new DeletionError(errorMessage)
    })

    await remove(toEvent(uuid()), null, callback)

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

    mockRemoveIdea.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await remove(toEvent(uuid()), null, callback)

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
