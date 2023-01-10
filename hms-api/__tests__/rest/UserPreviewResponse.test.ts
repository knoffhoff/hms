import {makeUser, UserData} from '../repository/domain/user-maker';
import UserPreviewResponse from '../../src/rest/User/UserPreviewResponse';

describe('Compare', () => {
  test('All values different', () => {
    const a = UserPreviewResponse.from(
      makeUser({
        firstName: 'a',
      } as UserData),
    );
    const b = UserPreviewResponse.from(
      makeUser({
        firstName: 'b',
      } as UserData),
    );

    expect(UserPreviewResponse.compare(a, b)).toBeLessThan(0);
    expect(UserPreviewResponse.compare(b, a)).toBeGreaterThan(0);
  });

  test('Same first names', () => {
    const a = UserPreviewResponse.from(
      makeUser({
        firstName: 'a',
        lastName: 'k',
      } as UserData),
    );
    const b = UserPreviewResponse.from(
      makeUser({
        firstName: 'a',
        lastName: 'l',
      } as UserData),
    );

    expect(UserPreviewResponse.compare(a, b)).toBeLessThan(0);
    expect(UserPreviewResponse.compare(b, a)).toBeGreaterThan(0);
  });

  test('Same first names, last names', () => {
    const a = UserPreviewResponse.from(
      makeUser({
        id: 'a',
        firstName: 'a',
        lastName: 'k',
      } as UserData),
    );
    const b = UserPreviewResponse.from(
      makeUser({
        id: 'b',
        firstName: 'a',
        lastName: 'k',
      } as UserData),
    );

    expect(UserPreviewResponse.compare(a, b)).toBeLessThan(0);
    expect(UserPreviewResponse.compare(b, a)).toBeGreaterThan(0);
  });

  test('All values same', () => {
    const a = UserPreviewResponse.from(
      makeUser({
        id: 'a',
        firstName: 'a',
        lastName: 'k',
      } as UserData),
    );
    const b = UserPreviewResponse.from(
      makeUser({
        id: 'a',
        firstName: 'a',
        lastName: 'k',
      } as UserData),
    );

    expect(UserPreviewResponse.compare(a, b)).toBe(0);
    expect(UserPreviewResponse.compare(b, a)).toBe(0);
  });
});
