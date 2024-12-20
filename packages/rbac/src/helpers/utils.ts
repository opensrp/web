import {
  allSupportedRoles,
  Permit,
  PermitKey,
  ResourcePermitMap,
  AllSupportedRoles,
} from '../constants';
import invariant from 'invariant';

/**
 * convert to array if not array
 *
 * @param obj - value to conver to array if not array.
 */
export function makeArray<T>(obj: T | T[]): T[] {
  let asArray = obj as T[];
  if (!Array.isArray(obj)) {
    asArray = [obj];
  }
  return asArray;
}

export const permitLiteralKeys = Object.keys(Permit).map((x) => x.toLowerCase());

/**
 * validates that a string is a valid representation of one of the recognized
 * resource permit combinations.
 *
 * @param permission - string to be validated.
 */
export function validatePermissionStr(permission: string) {
  const parts = permission.split('.');
  if (parts.length !== 2) {
    return false;
  }
  const [resource, permit] = parts;
  const resourceIsRecognized = allSupportedRoles.includes(resource as AllSupportedRoles);
  const permitIsRecognized = permitLiteralKeys.includes(permit.toLowerCase());
  if (!resourceIsRecognized || !permitIsRecognized) {
    return false;
  }
  return true;
}

/**
 * creates resourcePermit maps from human readable strings
 *
 * @param permissions - string of arrays to be converted to resourcePermitMaps
 */
export function parsePermissionStr(permissions: string[]) {
  return permissions.map((permission) => {
    const newMap: ResourcePermitMap = new Map();
    const permissionStrIsValid = validatePermissionStr(permission);
    invariant(
      permissionStrIsValid,
      `Permission string: '${permission}' is not internally recognized as a valid permission string.`
    );
    const parts = permission.split('.');
    const resource = parts[0] as AllSupportedRoles;
    const permit = Permit[parts[1].toUpperCase() as PermitKey];
    newMap.set(resource, permit);
    return newMap;
  });
}

/**
 * @param resourcePermits array of resource permits to merge into one resource permit map
 */
export function combineResourcePermits(resourcePermits: ResourcePermitMap[]) {
  return resourcePermits.reduce((acc, map) => {
    for (const [resource, permit] of map.entries()) {
      const existingPermit = acc.get(resource);
      if (existingPermit) {
        acc.set(resource, existingPermit | permit);
      } else {
        acc.set(resource, permit);
      }
    }
    return acc;
  }, new Map());
}
