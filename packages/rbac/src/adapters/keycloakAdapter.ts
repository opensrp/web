import { AllSupportedRoles, allSupportedRoles, Permit } from '../constants';
import { RbacAdapter } from '../helpers/types';
import { UserRole } from '../roleDefinition';
import { clientIdConfig, getConfig } from '@opensrp/pkg-config';

const fhirVerbToPermitLookup: Record<string, Permit> = {
  GET: Permit.READ,
  POST: Permit.CREATE,
  PUT: Permit.UPDATE,
  DELETE: Permit.DELETE,
  MANAGE: Permit.MANAGE,
};

const getFhirResourceString = (rawResourceString: string): AllSupportedRoles | undefined => {
  const matchedResource = allSupportedRoles.filter(
    (resource) => resource.toUpperCase() === rawResourceString.toUpperCase()
  );
  return matchedResource[0];
};

export const parseFHirRoles = (role: string) => {
  //https://github.com/opensrp/fhircore/discussions/1603
  const separator = '_';
  const roleParts = role.split(separator);
  // should have at-least 2 parts
  if (roleParts.length < 2) {
    return;
  }
  // first part is the verb
  const [verb, ...rest] = roleParts;
  const rawResource = rest.join(separator);
  const resource = getFhirResourceString(rawResource);
  const permit = fhirVerbToPermitLookup[verb.toUpperCase()];
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (resource && permit) {
    return new UserRole(resource as AllSupportedRoles, permit);
  }
};

export const parseKeycloakClientRoles = (scope: string, stringRole: string) => {
  const configuredClientId = getConfig(clientIdConfig) ?? '';
  const keycloakRoleMappings: Record<string, Record<string, UserRole> | undefined> = {
    'realm-management': {
      'realm-admin': new UserRole(
        ['iam_group', 'iam_role', 'iam_user', 'iam_realm'],
        Permit.MANAGE
      ),
      'manage-realm': new UserRole(
        ['iam_group', 'iam_role', 'iam_user', 'iam_realm'],
        Permit.MANAGE
      ),
      'view-realm': new UserRole(['iam_group', 'iam_role', 'iam_user', 'iam_realm'], Permit.READ),
      'query-realm': new UserRole(['iam_group', 'iam_role', 'iam_user', 'iam_realm'], Permit.READ),
      'view-users': new UserRole(['iam_user'], Permit.READ),
      'query-users': new UserRole(['iam_user'], Permit.READ),
      'manage-users': new UserRole(['iam_user'], Permit.MANAGE),
      'query-groups': new UserRole(['iam_group'], Permit.READ),
      'view-groups': new UserRole(['iam_group'], Permit.READ),
    },
    account: {
      'manage-account': new UserRole(
        ['account_user', 'account_application', 'account_group'],
        Permit.MANAGE
      ),
      'view-groups': new UserRole(['account_group'], Permit.READ),
    },
  };

  if (scope === configuredClientId) {
    return parseFHirRoles(stringRole);
  }
  const lookedURole = keycloakRoleMappings[scope]?.[stringRole] as UserRole | undefined;
  return lookedURole;
};

export interface KeycloakRoleData {
  realmAccess?: string[];
  clientRoles?: Record<string, string[]>;
}

const defaultRoleData = {
  realmAccess: [],
  clientRoles: {},
};

export const adapter: RbacAdapter = (roles: KeycloakRoleData = defaultRoleData) => {
  /**
    parse each role, figure out which resource and verb permission it maps to and add that to the permission object
   */
  const allRoleStrings = roles.realmAccess ?? [];
  const allRoles: UserRole[] = [];
  const invalidRoleStrings: string[] = [];
  for (const role of allRoleStrings) {
    const asRoleDef = parseFHirRoles(role);
    if (asRoleDef) {
      allRoles.push(asRoleDef);
    } else {
      invalidRoleStrings.push(role);
    }
  }
  Object.entries(roles.clientRoles ?? {}).forEach(([scope, roleArray]) => {
    roleArray.forEach((role) => {
      // check if we can first get a hit from keycloak default roles.
      let asRole = parseKeycloakClientRoles(scope, role);

      if (asRole === undefined) {
        asRole = parseFHirRoles(role);
      }
      if (asRole) {
        allRoles.push(asRole);
      } else {
        invalidRoleStrings.push(role);
      }
    });
  });

  if (invalidRoleStrings.length > 0) {
    /* eslint-disable no-console */
    console.warn(`Could not understand the following roles: ${invalidRoleStrings.join(', ')}`);
  }
  return UserRole.combineRoles(allRoles);
};
