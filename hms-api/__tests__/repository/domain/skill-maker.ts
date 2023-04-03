import Uuid, { uuid } from '../../../src/util/Uuid'
import Skill from '../../../src/repository/domain/Skill'

export interface SkillData {
  id: Uuid;
  name: string;
  description: string;
}

export const makeSkill = (
  {
    id = uuid(),
    name = 'Testing',
    description = 'Just being wicked good at testing',
  }: SkillData): Skill => new Skill(name, description, id)

export const randomSkill = (): Skill => makeSkill({} as SkillData)
