import * as ideaService from '../../../src/service/idea-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import IdeaJoinResponse from '../../../src/rest/Idea/IdeaJoinResponse';
import {join} from '../../../src/handler/idea/join';

const mockAddParticipant = jest.fn();
jest
  .spyOn(ideaService, 'addParticipant')
  .mockImplementation(mockAddParticipant);

describe('Join Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const participantId = uuid();
    const event = toEvent(ideaId, participantId);
    const callback = jest.fn();

    await join(event, null, callback);

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

const toEvent = (id: Uuid, participantId: Uuid): object => ({
  pathParameters: {
    id: id,
    participantId: participantId,
  },
});
