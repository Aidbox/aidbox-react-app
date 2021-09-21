import { Role, RoleLinks, User } from '../contrib/aidbox';

export enum UserRole {
  Practitioner = 'practitioner',
  Patient = 'patient',
}

type GenericRole<R, L extends keyof RoleLinks> = Omit<Role, 'name' | 'links'> & {
  name: R;
  links: RoleLinks & Required<Pick<RoleLinks, L>>;
};

export type RolePractitioner = GenericRole<'practitioner', 'practitioner'>;
export type RolePatient = GenericRole<'patient', 'patient'>;

export interface UserWithRoles extends User {
  role?: Array<Role>;
}

export function isRolePatient(role: Role): role is RolePatient {
  return role.name === UserRole.Patient;
}

export function isRolePractitioner(role: Role): role is RolePractitioner {
  return role.name === UserRole.Practitioner;
}
