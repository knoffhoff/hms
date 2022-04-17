/* eslint-disable require-jsdoc */

enum Role {
  Admin = 'Admin',
  Participant = 'Participant',
}

export const mapRolesToStrings = (roles: Role[]): string[] =>
  roles.map((role) => role.toString());

export const mapStringToRoles = (roles: string[]): Role[] =>
  roles.map((role) => Role[role]);

export default Role;
