import { randomParticipant } from '../../repository/domain/participant-maker'
import { get } from '../../../src/handler/participant/get'
import NotFoundError from '../../../src/error/NotFoundError'
import * as participantService from '../../../src/service/participant-service'
import Uuid, { uuid } from '../../../src/util/Uuid'
import { randomHackathon } from '../../repository/domain/hackathon-maker'
import ParticipantResponse from '../../../src/rest/participant/ParticipantResponse'
import ReferenceNotFoundError from '../../../src/error/ReferenceNotFoundError'
import { randomUser } from '../../repository/domain/user-maker'

const mockGetParticipant = jest
  .spyOn(participantService, 'getParticipantResponse')
  .mockImplementation()

describe('Get Participant', () => {
  test('Happy Path', async () => {
    const participant = randomParticipant()
    const expected = ParticipantResponse.from(
      participant,
      randomUser(),
      randomHackathon(),
    )
    const event = toEvent(participant.id)
    const callback = jest.fn()

    mockGetParticipant.mockResolvedValueOnce(expected)

    await get(event, null, callback)

    expect(mockGetParticipant).toHaveBeenCalledWith(participant.id)
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

    mockGetParticipant.mockImplementation(() => {
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

    mockGetParticipant.mockImplementation(() => {
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

    mockGetParticipant.mockImplementation(() => {
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
