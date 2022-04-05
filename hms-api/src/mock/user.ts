import {Role, UserListResponse, UserResponse, Uuid} from '../core';
import {backend, bearHandling, beeHandling, design, frontend} from './skill';

export const userId1: Uuid = '629f52c9-df29-491b-82a4-bdd80806338d';
export const user1 = new UserResponse(
    userId1,
    'Greg',
    'Greggson',
    'greg.greggson@internet.com',
    new Set<Role>([Role.Admin, Role.Participant]),
    new Set<string>([frontend.name, backend.name]),
    '',
);

export const userId2: Uuid = 'c3480d57-5670-4364-b0cc-9038a83de628';
export const user2 = new UserResponse(
    userId2,
    'Susy',
    'Q',
    'susy.q@internet.com',
    new Set<Role>([Role.Participant]),
    new Set<string>([bearHandling.name, backend.name]),
    '',
);

export const userId3: Uuid = 'c16785af-d7bd-442c-b3f5-257fad9ad2ac';
export const user3 = new UserResponse(
    userId3,
    'Dart',
    'Mouth',
    'dart.mouth@internet.com',
    new Set<Role>([Role.Participant]),
    new Set<string>([design.name, frontend.name, backend.name]),
    '',
);

export const userId4: Uuid = 'c34a519a-be46-410c-828e-0f806cfca620';
export const user4 = new UserResponse(
    userId4,
    'Cor',
    'Nell',
    'cor.nell@internet.com',
    new Set<Role>([Role.Participant]),
    new Set<string>([beeHandling.name, beeHandling.name, design.name]),
    '',
);

export const userId5: Uuid = 'f6fa2b8e-68ed-4486-b8df-f93b87ff23e5';
export const user5 = new UserResponse(
    userId5,
    'Baldy',
    'McBaldhead',
    'baldy.mcbaldhead@internet.com',
    new Set<Role>([Role.Participant]),
    new Set<string>([beeHandling.name, design.name]),
    '',
);

export const userId6: Uuid = '9b184ff3-8b63-4807-a3c6-89973c126d75';
export const user6 = new UserResponse(
    userId6,
    'Micheal',
    'Scott',
    'm.g.s@internet.com',
    new Set<Role>([Role.Participant]),
    new Set<string>([]),
    '',
);

// eslint-disable-next-line require-jsdoc
export function getUser(id: Uuid): UserResponse {
  switch (id) {
    case userId1:
      return user1;
    case userId2:
      return user2;
    case userId3:
      return user3;
    case userId4:
      return user4;
    case userId5:
      return user5;
    case userId6:
      return user6;
  }
}

export const userIds = new UserListResponse(
    new Set<Uuid>([userId1, userId2, userId3, userId4, userId5, userId6]));
