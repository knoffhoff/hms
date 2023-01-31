import * as ideaService from '../../../src/service/idea-service';
import Uuid, {uuid} from '../../../src/util/Uuid';
import {leave} from '../../../src/handler/idea/leave';
import IdeaLeaveResponse from '../../../src/rest/idea/IdeaLeaveResponse';

const mockRemoveParticipant = jest.fn();
jest
  .spyOn(ideaService, 'removeParticipant')
  .mockImplementation(mockRemoveParticipant);

describe('Leave Idea', () => {
  test('Happy Path', async () => {
    const ideaId = uuid();
    const participantId = uuid();
    const event = toEvent(ideaId, participantId);
    const callback = jest.fn();

    await leave(event, null, callback);

    expect(mockRemoveParticipant).toHaveBeenCalledWith(ideaId, participantId);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'content-type': 'application/json',
      },
      body: JSON.stringify(new IdeaLeaveResponse(ideaId, participantId)),
    });
  });
});

const toEvent = (id: Uuid, participantId: Uuid): object => ({
  pathParameters: {
    id: id,
    participantId: participantId,
  },
});
