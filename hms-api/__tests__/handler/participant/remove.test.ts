import * as participantService from '../../../src/service/participant-service'
import { remove } from '../../../src/handler/participant/remove'
import ParticipantDeleteResponse from '../../../src/rest/participant/ParticipantDeleteResponse'
import Uuid, { uuid } from '../../../src/util/Uuid'
import UserDeleteResponse from '../../../src/rest/user/UserDeleteResponse'
import DeletionError from '../../../src/error/DeletionError'

const mockRemoveParticipant = jest
  .spyOn(participantService, 'removeParticipant')
  .mockImplementation()

describe('Delete Participant', () => {
  test('Happy Path', async () => {
    const id = uuid()
    const event = toEvent(id)
    const callback = jest.fn()

    mockRemoveParticipant.mockResolvedValueOnce(new UserDeleteResponse(id))

    await remove(event, null, callback)

    expect(mockRemoveParticipant).toHaveBeenCalledWith(id)
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new ParticipantDeleteResponse(id)),
    })
  })

  test('Throws DeletionError', async () => {
    const errorMessage = 'deletion error message'
    const callback = jest.fn()

    mockRemoveParticipant.mockImplementation(() => {
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

    mockRemoveParticipant.mockImplementation(() => {
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
