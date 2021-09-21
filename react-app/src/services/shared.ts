import { UserWithRoles } from './role';
import { Role } from '../aidbox';

// TODO: Remove this right after effector
export interface Session {
    user: UserWithRoles;
    role: Role;
}
