import * as ideaService from '../../../src/service/idea-service'
import Uuid, { uuid } from '../../../src/util/Uuid'
import { revokeVote } from '../../../src/handler/idea/revokeVote'
import IdeaVoteResponse from '../../../src/rest/idea/IdeaVoteResponse'

const mockRemoveVoter = jest
  .spyOn(ideaService, 'removeVoter')
  .mockImplementation()

describe('Remove vote from Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid()
    const participantId = uuid()
    const event = toEvent(ideaId, participantId)
    const callback = jest.fn()

    await revokeVote(event, null, callback)

    expect(mockRemoveVoter).toHaveBeenCalledWith(ideaId, participantId)
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaVoteResponse(ideaId, participantId)),
    })
  })

  test('Throws Error', async () => {
    const errorMessage = 'generic error message'
    const callback = jest.fn()

    mockRemoveVoter.mockImplementation(() => {
      throw new Error(errorMessage)
    })

    await revokeVote(toEvent(uuid(), uuid()), null, callback)

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

const toEvent = (ideaId: Uuid, participantId: Uuid): any => ({
  pathParameters: {
    id: ideaId,
    participantId: participantId,
  },
})
