import { isRolePatient, isRolePractitioner, RolePatient, RolePractitioner, UserRole } from '../services/role';
import React from 'react';
import { User } from '../aidbox';
import { Session } from '../services/shared';

interface Props {
  children: {
    [UserRole.Practitioner]?: (props: { user: User; role: RolePractitioner }) => React.ReactNode;
    [UserRole.Patient]?: (props: { user: User; role: RolePatient }) => React.ReactNode;
    default?: (props: { user: User }) => React.ReactNode;
  };
}

export function RoleSwitch(props: Props) {
  const session: Session = {
    user: { resourceType: 'User', id: '123' },
    role: { resourceType: 'Role', name: 'practitioner', user: { resourceType: 'User', id: '123' } },
  };

  const { children: mapping } = props;

  const defaultRenderFn = mapping.default ? mapping.default : () => null;

  const render = ({ user, role }: Session) => {
    if (isRolePractitioner(role)) {
      const renderFn = mapping[UserRole.Practitioner] || defaultRenderFn;

      return renderFn({ user, role });
    } else if (isRolePatient(role)) {
      const renderFn = mapping[UserRole.Patient] || defaultRenderFn;

      return renderFn({ user, role });
    }
    return defaultRenderFn({ user });
  };

  return <>{render(session)}</>;
}