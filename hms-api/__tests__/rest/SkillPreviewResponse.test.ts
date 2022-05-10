import {makeSkill, SkillData} from '../repository/domain/skill-maker';
import SkillPreviewResponse from '../../src/rest/SkillPreviewResponse';

describe('Compare', () => {
  test('All values different', () => {
    const a = SkillPreviewResponse.from(makeSkill({
      name: 'a',
    } as SkillData));
    const b = SkillPreviewResponse.from(makeSkill({
      name: 'b',
    } as SkillData));

    expect(SkillPreviewResponse.compare(a, b)).toBeLessThan(0);
    expect(SkillPreviewResponse.compare(b, a)).toBeGreaterThan(0);
  });

  test('Same names', () => {
    const a = SkillPreviewResponse.from(makeSkill({
      id: 'a',
      name: 'a',
    } as SkillData));
    const b = SkillPreviewResponse.from(makeSkill({
      id: 'b',
      name: 'a',
    } as SkillData));

    expect(SkillPreviewResponse.compare(a, b)).toBeLessThan(0);
    expect(SkillPreviewResponse.compare(b, a)).toBeGreaterThan(0);
  });

  test('All values same', () => {
    const a = SkillPreviewResponse.from(makeSkill({
      id: 'a',
      name: 'a',
    } as SkillData));
    const b = SkillPreviewResponse.from(makeSkill({
      id: 'a',
      name: 'a',
    } as SkillData));

    expect(SkillPreviewResponse.compare(a, b)).toBe(0);
    expect(SkillPreviewResponse.compare(b, a)).toBe(0);
  });
});
