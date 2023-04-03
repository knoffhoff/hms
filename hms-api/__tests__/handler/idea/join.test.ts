import * as ideaService from '../../../src/service/idea-service'
import Uuid, { uuid } from '../../../src/util/Uuid'
import IdeaJoinResponse from '../../../src/rest/idea/IdeaJoinResponse'
import { join } from '../../../src/handler/idea/join'
import NotFoundError from '../../../src/error/NotFoundError'
import InvalidStateError from '../../../src/error/InvalidStateError'

const mockAddParticipant = jest
  .spyOn(ideaService, 'addParticipant')
  .mockImplementation()

describe('Join Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid()
    const participantId = uuid()
    const event = toEvent(ideaId, participantId)
    const callback = jest.fn()

    await join(event, null, callback)

    expect(mockAddParticipant).toHaveBeenCalledWith(ideaId, participantId)
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaJoinResponse(ideaId, participantId)),
    })
  })

  test('Throws NotFoundError', async () => {
    const errorMessage = 'reference error message'
    const callback = jest.fn()

    mockAddParticipant.mockImplementation(() => {
      throw new NotFoundError(errorMessage)
    })

    await join(toEvent(uuid(), uuid()), null, callback)

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

    mockAddParticipant.mockImplementation(() => {
      throw new InvalidStateError(errorMessage)
    })

    await join(toEvent(uuid(), uuid()), null, callback)

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

    mockAddParticipant.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await join(toEvent(uuid(), uuid()), null, callback)

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
