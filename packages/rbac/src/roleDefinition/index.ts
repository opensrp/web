import { AllSupportedRoles, BinaryNumber, ResourcePermitMap } from '../constants';
import { MatchStrategy } from '../helpers/types';
import { combineResourcePermits, makeArray, parsePermissionStr } from '../helpers/utils';

export class UserRole {
  private permissions: ResourcePermitMap;

  constructor(resource: AllSupportedRoles | AllSupportedRoles[] = [], verb?: BinaryNumber) {
    const newMap = new Map();
    if (!verb) {
      this.permissions = newMap;
      return;
    }
    const resources = makeArray(resource);
    for (const type of resources) {
      newMap.set(type, verb);
    }
    this.permissions = newMap;
  }

  public getPermissionMap(): ResourcePermitMap {
    return this.permissions;
  }

  public hasRoles(roles: UserRole[] | UserRole): boolean {
    const toCheckRoles = makeArray(roles);

    for (const role of toCheckRoles) {
      for (const [key, value] of role.permissions.entries()) {
        if (!this.permissions.has(key)) {
          return false;
        }

        if (this.permissions.get(key) && value === 0) {
          return false;
        }
      }
    }
    return true;
  }

  public hasPermissions(permissions: string | string[], strategy: MatchStrategy = 'all') {
    // parse permission string to a ResourcePermisMap
    const permAsStr = makeArray(permissions);
    const permitMaps = parsePermissionStr(permAsStr);
    const permitApplies = (permitMap: ResourcePermitMap) => {
      for (const [resource, permit] of permitMap.entries()) {
        if (!this.permissions.has(resource)) {
          return false;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const activePermit = this.permissions.get(resource)!;
        return (activePermit & permit) !== 0;
      }
    };
    switch (strategy) {
      case 'all':
        return permitMaps.every(permitApplies);
      case 'any':
        return permitMaps.some(permitApplies);
      default:
        return false;
    }
  }

  public static fromResourceMap(resourceMap: ResourcePermitMap) {
    const mapEntries = [...resourceMap.entries()];
    if (!mapEntries.length) {
      return;
    }
    const last = mapEntries.pop() as [AllSupportedRoles, number];
    const resourceType = last[0];
    const verb = last[1];
    const newRole = new UserRole(resourceType, verb);
    for (const [resourceType, verb] of mapEntries) {
      newRole.permissions.set(resourceType, verb);
    }
    return newRole;
  }

  public static fromPermissionStrings(permissionStrings: string | string[]) {
    const permAsStr = makeArray(permissionStrings);
    const permitMaps = parsePermissionStr(permAsStr);
    const combinedPermitMap = combineResourcePermits(permitMaps);
    return this.fromResourceMap(combinedPermitMap);
  }

  public static combineRoles(roles: UserRole[]): UserRole {
    /** create a resourceMap from this and then use it to create the role */
    const newResourceMap = new Map();
    for (const role of roles) {
      for (const [key, value] of role.getPermissionMap().entries()) {
        if (newResourceMap.has(key)) {
          newResourceMap.set(key, newResourceMap.get(key) | value);
        } else {
          newResourceMap.set(key, value);
        }
      }
    }
    return UserRole.fromResourceMap(newResourceMap) as UserRole;
  }
}
