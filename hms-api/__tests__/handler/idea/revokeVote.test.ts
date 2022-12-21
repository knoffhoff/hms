import * as ideaService from '../../../src/service/idea-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {revokeVote} from '../../../src/handler/idea/revokeVote';
import IdeaVoteResponse from '../../../src/rest/IdeaVoteResponse';

const mockRemoveVoter = jest.fn();
jest.spyOn(ideaService, 'removeVoter').mockImplementation(mockRemoveVoter);

describe('Remove vote from Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const participantId = uuid();
    const event = toEvent(ideaId, participantId);
    const callback = jest.fn();

    await revokeVote(event, null, callback);

    expect(mockRemoveVoter).toHaveBeenCalledWith(ideaId, participantId);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaVoteResponse(ideaId, participantId)),
    });
  });
});

const toEvent = (ideaId: Uuid, participantId: Uuid): any => ({
  pathParameters: {
    id: ideaId,
    participantId: participantId,
  },
});
