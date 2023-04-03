import { edit } from '../../../src/handler/hackathon/edit'
import Uuid, { uuid } from '../../../src/util/Uuid'
import * as hackathonService from '../../../src/service/hackathon-service'
import HackathonEditResponse from '../../../src/rest/hackathon/HackathonEditResponse'
import NotFoundError from '../../../src/error/NotFoundError'
import HackathonEditRequest from '../../../src/rest/hackathon/HackathonEditRequest'
import ValidationError from '../../../src/error/ValidationError'
import ValidationResult from '../../../src/error/ValidationResult'

const mockEditHackathon = jest
  .spyOn(hackathonService, 'editHackathon')
  .mockImplementation()

describe('Edit Hackathon', () => {
  const title = 'New fancy title'
  const description = 'Lorem ipsum dollar dollar bills y\'all'
  const slug = 'new_fancy_title'
  const startDate = new Date()
  const endDate = new Date(new Date().getTime() + 10000)
  const id = uuid()
  const votingOpened = true
  const callback = jest.fn()

  test('Happy Path', async () => {
    mockEditHackathon.mockImplementation()

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    )

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    )
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new HackathonEditResponse(id)),
    })
  })

  test('Throws NotFoundError', async () => {
    const errorMessage = 'Where is it????'

    mockEditHackathon.mockImplementation(() => {
      throw new NotFoundError(errorMessage)
    })

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    )

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
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

    mockEditHackathon.mockImplementation(() => {
      throw new ValidationError(errorMessage, new ValidationResult())
    })

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    )

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
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

    mockEditHackathon.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await edit(
      toEvent(title, description, slug, startDate, endDate, id, votingOpened),
      null,
      callback,
    )

    expect(mockEditHackathon).toHaveBeenCalledWith(
      id,
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
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
  title: string,
  description: string,
  slug: string,
  startDate: Date,
  endDate: Date,
  id: Uuid,
  votingOpened: boolean,
): object => ({
  body: JSON.stringify(
    new HackathonEditRequest(
      title,
      description,
      slug,
      startDate,
      endDate,
      votingOpened,
    ),
  ),
  pathParameters: {
    id: id,
  },
})
