import * as ideaService from '../../../src/service/idea-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {vote} from '../../../src/handler/idea/vote';
import IdeaJoinResponse from '../../../src/rest/IdeaJoinResponse';

const mockAddParticipant = jest.fn();
jest
  .spyOn(ideaService, 'addParticipant')
  .mockImplementation(mockAddParticipant);

describe('Vote for Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const participantId = uuid();

    const event = toEvent(ideaId, participantId);
    const callback = jest.fn();

    await vote(event, null, callback);

    expect(mockAddParticipant).toHaveBeenCalledWith(ideaId, participantId);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaJoinResponse(ideaId, participantId)),
    });
  });
});

const toEvent = (ideaId: Uuid, participantId: Uuid): any => ({
  pathParameters: {
    ideaId: ideaId,
    participantId: participantId,
  },
});
