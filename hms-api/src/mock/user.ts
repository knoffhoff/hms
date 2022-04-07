import {Uuid} from '../util/uuids';
import {Role} from '../repository/domain/Role';
import {UserListResponse, UserResponse} from '../rest/user';
import {backend, bearHandling, beeHandling, design, frontend} from './skill';

export const userId1: Uuid = '629f52c9-df29-491b-82a4-bdd80806338d';
export const user1 = new UserResponse(
    userId1,
    'Greg',
    'Greggson',
    'greg.greggson@internet.com',
    [Role.Admin, Role.Participant],
    [frontend.name, backend.name],
    '',
    new Date('2021-03-01'),
);

export const userId2: Uuid = 'c3480d57-5670-4364-b0cc-9038a83de628';
export const user2 = new UserResponse(
    userId2,
    'Susy',
    'Q',
    'susy.q@internet.com',
    [Role.Participant],
    [bearHandling.name, backend.name],
    '',
    new Date('2021-03-02'),
);

export const userId3: Uuid = 'c16785af-d7bd-442c-b3f5-257fad9ad2ac';
export const user3 = new UserResponse(
    userId3,
    'Dart',
    'Mouth',
    'dart.mouth@internet.com',
    [Role.Participant],
    [design.name, frontend.name, backend.name],
    '',
    new Date('2021-03-03'),
);

export const userId4: Uuid = 'c34a519a-be46-410c-828e-0f806cfca620';
export const user4 = new UserResponse(
    userId4,
    'Cor',
    'Nell',
    'cor.nell@internet.com',
    [Role.Participant],
    [beeHandling.name, beeHandling.name, design.name],
    '',
    new Date('2021-03-03'),
);

export const userId5: Uuid = 'f6fa2b8e-68ed-4486-b8df-f93b87ff23e5';
export const user5 = new UserResponse(
    userId5,
    'Baldy',
    'McBaldhead',
    'baldy.mcbaldhead@internet.com',
    [Role.Participant],
    [beeHandling.name, design.name],
    '',
    new Date('2021-03-05'),
);

export const userId6: Uuid = '9b184ff3-8b63-4807-a3c6-89973c126d75';
export const user6 = new UserResponse(
    userId6,
    'Micheal',
    'Scott',
    'm.g.s@internet.com',
    [Role.Participant],
    [],
    '',
    new Date('2021-03-06'),
);

// eslint-disable-next-line require-jsdoc
export function getUser(id: Uuid): UserResponse | null {
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
    default:
      return null;
  }
}

export const userIds = new UserListResponse([
  userId1,
  userId2,
  userId3,
  userId4,
  userId5,
  userId6,
]);
