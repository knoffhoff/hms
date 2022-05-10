import {IdeaData, makeIdea} from '../repository/domain/idea-maker';
import IdeaPreviewResponse from '../../src/rest/IdeaPreviewResponse';

describe('Compare', () => {
  test('All values different', () => {
    const a = IdeaPreviewResponse.from(makeIdea({
      creationDate: new Date(0),
    } as IdeaData));
    const b = IdeaPreviewResponse.from(makeIdea({
      creationDate: new Date(1),
    } as IdeaData));

    expect(IdeaPreviewResponse.compare(a, b)).toBeLessThan(0);
    expect(IdeaPreviewResponse.compare(b, a)).toBeGreaterThan(0);
  });

  test('Same creation dates', () => {
    const a = IdeaPreviewResponse.from(makeIdea({
      id: 'a',
      creationDate: new Date(0),
    } as IdeaData));
    const b = IdeaPreviewResponse.from(makeIdea({
      id: 'b',
      creationDate: new Date(0),
    } as IdeaData));

    expect(IdeaPreviewResponse.compare(a, b)).toBeLessThan(0);
    expect(IdeaPreviewResponse.compare(b, a)).toBeGreaterThan(0);
  });

  test('All values same', () => {
    const a = IdeaPreviewResponse.from(makeIdea({
      id: 'a',
      creationDate: new Date(0),
    } as IdeaData));
    const b = IdeaPreviewResponse.from(makeIdea({
      id: 'a',
      creationDate: new Date(0),
    } as IdeaData));

    expect(IdeaPreviewResponse.compare(a, b)).toBe(0);
    expect(IdeaPreviewResponse.compare(b, a)).toBe(0);
  });
});
