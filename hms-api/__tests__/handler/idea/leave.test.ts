import * as ideaService from '../../../src/service/idea-service'
import Uuid, { uuid } from '../../../src/util/Uuid'
import { leave } from '../../../src/handler/idea/leave'
import IdeaLeaveResponse from '../../../src/rest/idea/IdeaLeaveResponse'
import NotFoundError from '../../../src/error/NotFoundError'
import InvalidStateError from '../../../src/error/InvalidStateError'

const mockRemoveParticipant = jest
  .spyOn(ideaService, 'removeParticipant')
  .mockImplementation()

describe('Leave Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid()
    const participantId = uuid()
    const event = toEvent(ideaId, participantId)
    const callback = jest.fn()

    await leave(event, null, callback)

    expect(mockRemoveParticipant).toHaveBeenCalledWith(ideaId, participantId)
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaLeaveResponse(ideaId, participantId)),
    })
  })

  test('Throws NotFoundError', async () => {
    const errorMessage = 'reference error message'
    const callback = jest.fn()

    mockRemoveParticipant.mockImplementation(() => {
      throw new NotFoundError(errorMessage)
    })

    await leave(toEvent(uuid(), uuid()), null, callback)

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

  test('Throws InvalidStateError', async () => {
    const errorMessage = 'invalid state error message'
    const callback = jest.fn()

    mockRemoveParticipant.mockImplementation(() => {
      throw new InvalidStateError(errorMessage)
    })

    await leave(toEvent(uuid(), uuid()), null, callback)

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

    mockRemoveParticipant.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await leave(toEvent(uuid(), uuid()), null, callback)

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

const toEvent = (id: Uuid, participantId: Uuid): object => ({
  pathParameters: {
    id: id,
    participantId: participantId,
  },
})
