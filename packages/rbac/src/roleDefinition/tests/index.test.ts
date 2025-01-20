import { UserRole } from '../index';
import { Permit } from '../../constants';

describe('user role definition', () => {
  it('empty userRole', () => {
    const userRole = new UserRole();
    // expect(userRole.hasPermissions("")).toBeFalsy();
    expect(userRole.hasPermissions('iam_user.read')).toBeFalsy();
    expect(userRole.hasPermissions([])).toBeTruthy();
  });

  it('create role is not included as part of read', () => {
    const readUserRole = UserRole.fromPermissionStrings('iam_user.read');
    expect(readUserRole?.hasPermissions('iam_user.create')).toBeFalsy();
  });

  it('strategies work correctly', () => {
    const readUserRole = UserRole.fromPermissionStrings('iam_user.read');
    expect(readUserRole?.hasPermissions('iam_user.read', 'all')).toBeTruthy();
    expect(readUserRole?.hasPermissions(['iam_user.read', 'iam_user.create'], 'all')).toBeFalsy();
    expect(readUserRole?.hasPermissions(['iam_user.read', 'iam_user.create'], 'any')).toBeTruthy();
  });
});

describe('UserRole Class', () => {
  test('constructor initializes empty role when no arguments are passed', () => {
    const role = new UserRole();
    expect(role.getPermissionMap().size).toBe(0);
  });

  test('constructor initializes permissions for a single resource', () => {
    const role = new UserRole('Flag', 1);
    expect(role.getPermissionMap().get('Flag')).toBe(1);
  });

  test('constructor initializes permissions for multiple resources', () => {
    const role = new UserRole(['Flag', 'Location'], 3);
    expect(role.getPermissionMap().get('Flag')).toBe(3);
    expect(role.getPermissionMap().get('Location')).toBe(3);
  });

  test('getPermissionMap returns the internal permissions map', () => {
    const role = new UserRole('Flag', 1);
    expect(role.getPermissionMap()).toEqual(new Map([['Flag', 1]]));
  });

  test('hasRoles returns true when all roles are satisfied', () => {
    const roleA = new UserRole('Flag', 1);
    const roleB = new UserRole('Flag', 1);
    expect(roleA.hasRoles(roleB)).toBe(true);
  });

  test('hasRoles returns false if any role is missing', () => {
    const roleA = new UserRole('Flag', 1);
    const roleB = new UserRole('Location', 1);
    expect(roleA.hasRoles(roleB)).toBe(false);
  });

  test('hasRoles returns false if a role exists but has insufficient permissions', () => {
    const roleA = new UserRole('Flag', Permit.READ);
    const roleB = new UserRole('Flag', Permit.MANAGE);
    expect(roleA.hasRoles(roleB)).toBe(false);
  });

  test('hasPermissions with strategy="all" returns true when all permissions are satisfied', () => {
    const role = new UserRole('Flag', 3);
    expect(role.hasPermissions(['Flag.read', 'Flag.create'], 'all')).toBe(true);
  });

  test('hasPermissions with strategy="all" returns false when any permission is missing', () => {
    const role = new UserRole('Flag', 1);
    expect(role.hasPermissions(['Flag.read', 'Flag.create'], 'all')).toBe(false);
  });

  test('hasPermissions with strategy="any" returns true when at least one permission is satisfied', () => {
    const role = new UserRole('Flag', 1);
    expect(role.hasPermissions(['Flag.read', 'Flag.create'], 'any')).toBe(true);
  });

  test('hasPermissions with strategy="any" returns false when no permissions are satisfied', () => {
    const role = new UserRole('Flag', 1);
    expect(role.hasPermissions(['Location.read'], 'any')).toBe(false);
  });

  test('fromResourceMap creates a UserRole from a ResourcePermitMap', () => {
    const resourceMap = new Map([
      ['Flag', Permit.READ],
      ['Location', Permit.MANAGE],
    ]);
    const role = UserRole.fromResourceMap(resourceMap);
    expect(role?.getPermissionMap()).toEqual(resourceMap);
  });

  test('fromPermissionStrings creates a UserRole from permission strings', () => {
    const permissions = ['Flag.read', 'Location.create'];
    const role = UserRole.fromPermissionStrings(permissions);
    expect(role?.hasPermissions(permissions, 'all')).toBe(true);
  });

  test('combineRoles combines multiple roles into one', () => {
    const roleA = new UserRole('Flag', 1);
    const roleB = new UserRole('Flag', 2);
    const combinedRole = UserRole.combineRoles([roleA, roleB]);
    expect(combinedRole.getPermissionMap().get('Flag')).toBe(3);
  });
});
