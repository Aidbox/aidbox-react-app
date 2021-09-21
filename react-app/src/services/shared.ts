import { UserWithRoles } from './role';
import { Role } from '../contrib/aidbox';

// TODO: Remove this right after effector
export interface Session {
  user: UserWithRoles;
  role: Role;
}
