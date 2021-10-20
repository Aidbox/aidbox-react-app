import { UserWithRoles } from 'shared/src/services/role';
import { Role } from 'shared/src/contrib/aidbox';

// TODO: Remove this right after effector
export interface Session {
  user: UserWithRoles;
  role: Role;
}
