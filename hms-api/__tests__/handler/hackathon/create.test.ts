import * as hackathonService from '../../../src/service/hackathon-service'
import { create } from '../../../src/handler/hackathon/create'
import { randomHackathon } from '../../repository/domain/hackathon-maker'
import HackathonCreateResponse from '../../../src/rest/hackathon/HackathonCreateResponse'
import Hackathon from '../../../src/repository/domain/Hackathon'
import HackathonCreateRequest from '../../../src/rest/hackathon/HackathonCreateRequest'
import ValidationError from '../../../src/error/ValidationError'
import ValidationResult from '../../../src/error/ValidationResult'
import InvalidStateError from '../../../src/error/InvalidStateError'

const mockCreateHackathon = jest
  .spyOn(hackathonService, 'createHackathon')
  .mockImplementation()

describe('Create Hackathon', () => {
  test('Happy Path', async () => {
    const expected = randomHackathon()
    const callback = jest.fn()

    mockCreateHackathon.mockResolvedValueOnce(expected)

    await create(toEvent(expected), null, callback)

    expect(mockCreateHackathon).toHaveBeenCalledWith(
      expected.title,
      expected.description,
      expected.slug,
      expected.startDate,
      expected.endDate,
    )
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new HackathonCreateResponse(expected.id)),
    })
  })

  test('Throws ValidationError', async () => {
    const errorMessage = 'validation error message'
    const callback = jest.fn()

    mockCreateHackathon.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult())
    })

    await create(toEvent(randomHackathon()), null, callback)
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

  test('Throws InvalidStateError', async () => {
    const errorMessage = 'invalid state error message'
    const callback = jest.fn()

    mockCreateHackathon.mockImplementation(() => {
      throw new InvalidStateError(errorMessage)
    })

    await create(toEvent(randomHackathon()), null, callback)

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

    mockCreateHackathon.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await create(toEvent(randomHackathon()), null, callback)

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

const toEvent = (hackathon: Hackathon): object => ({
  body: JSON.stringify(
    new HackathonCreateRequest(
      hackathon.title,
      hackathon.description,
      hackathon.slug,
      hackathon.startDate,
      hackathon.endDate,
    ),
  ),
})
