import IdeaListResponse from '../../src/rest/Idea/IdeaListResponse';
import {IdeaData, makeIdea} from '../repository/domain/idea-maker';
import IdeaPreviewResponse from '../../src/rest/Idea/IdeaPreviewResponse';
import {uuid} from '../../src/util/Uuid';

describe('Convert From', () => {
  test('Categories are sorted', () => {
    const idea1 = makeIdea({creationDate: new Date(0)} as IdeaData);
    const idea2 = makeIdea({creationDate: new Date(1)} as IdeaData);
    const idea3 = makeIdea({creationDate: new Date(2)} as IdeaData);
    const hackathonId = uuid();

    const response = IdeaListResponse.from([idea3, idea1, idea2], hackathonId);

    expect(response).toEqual(
      new IdeaListResponse(
        [
          IdeaPreviewResponse.from(idea1),
          IdeaPreviewResponse.from(idea2),
          IdeaPreviewResponse.from(idea3),
        ],
        hackathonId,
      ),
    );
  });
});
