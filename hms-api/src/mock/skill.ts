import {SkillListResponse, SkillResponse} from '../rest/skill';

export const frontendName = 'frontend';
export const frontend = new SkillResponse(
    frontendName,
    'Pretty programming',
);

export const backendName = 'backend';
export const backend = new SkillResponse(
    backendName,
    'Programming for the basement kids',
);

export const designName = 'design';
export const design = new SkillResponse(
    designName,
    'Designing things and making them pretty',
);

export const bearHandlingName = 'bear handling';
export const bearHandling = new SkillResponse(
    bearHandlingName,
    'You can handle bears... without getting eaten',
);

export const beeHandlingName = 'bee handling';
export const beeHandling = new SkillResponse(
    beeHandlingName,
    'You can handle bees... and not get stung too much',
);

export const skills = new SkillListResponse([
  frontendName,
  backendName,
  designName,
  bearHandlingName,
  beeHandlingName,
]);

// eslint-disable-next-line require-jsdoc
export function getSkill(name: string): SkillResponse | null {
  switch (name) {
    case frontendName:
      return frontend;
    case backendName:
      return backend;
    case designName:
      return design;
    case bearHandlingName:
      return bearHandling;
    case beeHandlingName:
      return beeHandling;
    default:
      return null;
  }
}
