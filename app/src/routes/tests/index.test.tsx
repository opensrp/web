import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { filterFalsyRoutes, getRoutes } from '..';
import { DashboardOutlined } from '@ant-design/icons';
import { superUserRole } from '@opensrp/react-utils';
import UploadIcon from '@2fd/ant-design-icons/lib/Upload';

jest.mock('../../configs/env');
jest.mock('../../configs/settings');

describe('routes', () => {
  it('Test routes only return enabled values', () => {
    const routes = filterFalsyRoutes(
      [
        {
          children: [
            { key: 'child-x-a', title: 'a', url: '/child-x/a' },
            { key: 'child-x-t', title: 't', url: '/child-x/t' },
          ],
          key: 'child-x',
          title: 'child-x',
        },
        {
          children: [
            {
              children: [
                { key: 'childs-y', title: 'childs-y', url: '/admin/childs-y' },
                { key: 'childs-y-r', title: 'childs-y', url: '/admin/childs-y/r' },
              ],
              enabled: true,
              key: 'childs-y',
              title: 'childs-y',
            },
            {
              children: [
                { key: 'child-z-u', title: 'child-z-u', url: '/admin/child-z/u' },
                { key: 'child-z-g', title: 'child-z-g', url: '/admin/child-z/g' },
              ],
              enabled: undefined,
              key: 'child-z',
              title: 'child-z',
            },
            {
              enabled: false,
              key: 'child-i',
              title: 'child-i',
              url: '/admin/child-i',
              children: [
                { key: 'child-i-u', enabled: true, title: 'child-i-u', url: '/admin/child-i/u' },
                { key: 'child-i-g', enabled: true, title: 'child-i-g', url: '/admin/child-i/g' },
              ],
            },
          ],
          enabled: true,
          key: 'admin',
          title: 'Administration',
        },
      ],
      superUserRole
    );

    expect(routes).toMatchObject([
      {
        children: [
          { key: 'child-x-a', title: 'a', url: '/child-x/a' },
          { key: 'child-x-t', title: 't', url: '/child-x/t' },
        ],
        key: 'child-x',
        title: 'child-x',
      },
      {
        children: [
          {
            children: [
              { key: 'childs-y', title: 'childs-y', url: '/admin/childs-y' },
              { key: 'childs-y-r', title: 'childs-y', url: '/admin/childs-y/r' },
            ],
            enabled: true,
            key: 'childs-y',
            title: 'childs-y',
          },
        ],
        enabled: true,
        key: 'admin',
        title: 'Administration',
      },
    ]);
  });

  it('Test Enabled Routes', () => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );

    let envModule = require('../../configs/env');
    envModule.ENABLE_FHIR_LOCATIONS = true;
    envModule.ENABLE_FHIR_TEAMS = true;
    envModule.ENABLE_TEAMS_ASSIGNMENT_MODULE = true;
    envModule.ENABLE_FHIR_USER_MANAGEMENT = true;
    envModule.ENABLE_QUEST = true;

    let routes = getRoutes(
      ['ROLE_EDIT_KEYCLOAK_USERS', 'ROLE_VIEW_KEYCLOAK_USERS'],
      (t: string) => t,
      superUserRole
    );
    expect(routes).toMatchObject([
      {
        children: [
          {
            children: [
              {
                key: 'users',
                title: 'Users',
                permissions: ['iam_user.read'],

                url: '/admin/users',
              },
              {
                key: 'user-groups',
                permissions: ['iam_group.read'],

                title: 'User Groups',
                url: '/admin/users/groups',
              },
              {
                key: 'user-roles',
                permissions: ['iam_role.read'],
                title: 'User Roles',
                url: '/admin/users/roles',
              },
            ],
            enabled: true,
            isHomePageLink: true,
            key: 'user-management',
            permissions: ['iam_user.read'],
            title: 'User Management',
            url: '/admin/users',
          },
          {
            children: [
              {
                key: 'location-unit',
                permissions: ['Location.read'],

                title: 'Hierarchy',
                url: '/admin/location/unit',
              },
              {
                key: 'all-locations',
                permissions: ['Location.read'],

                title: 'All Locations',
                url: '/admin/location/all',
              },
            ],
            enabled: true,
            isHomePageLink: true,
            key: 'location-management',
            permissions: ['Location.read'],

            title: 'Location Management',
            url: '/admin/location/unit',
          },
          {
            children: [
              {
                key: 'ORGS',
                permissions: ['Organization.read'],

                title: 'Organizations',
                url: '/admin/teams',
              },
              {
                enabled: true,
                key: 'org-assignment',
                permissions: ['OrganizationAffiliation.read', 'Location.read'],

                title: 'Organization Assignment',
                url: '/admin/teams/team-assignment',
              },
            ],
            enabled: true,
            isHomePageLink: true,
            key: 'org-management',
            permissions: ['Organization.read'],

            title: 'Organization Management',
            url: '/admin/teams',
          },
          {
            enabled: true,
            isHomePageLink: true,
            key: 'fhir-quest',
            permissions: ['Questionnaire.read'],

            title: 'Questionnaire Management',
            url: '/quest',
          },
        ],
        enabled: true,
        key: 'admin',
        otherProps: {
          icon: <DashboardOutlined />,
        },
        permissions: [],
        title: 'Administration',
      },
      {
        enabled: true,
        isHomePageLink: true,
        key: 'data-import',
        otherProps: {
          icon: <UploadIcon />,
        },
        permissions: ['DataImport.read'],
        title: 'Data Imports',
        url: '/import',
      },
    ]);
  });

  it('#1135 Enable envs are not coupled', () => {
    store.dispatch(
      authenticateUser(true, {
        email: 'bob@example.com',
        name: 'Bobbie',
        username: 'RobertBaratheon',
      })
    );
    const routes = getRoutes(
      ['ROLE_EDIT_KEYCLOAK_USERS', 'ROLE_VIEW_KEYCLOAK_USERS'],
      (t: string) => t,
      superUserRole
    );
    const parentKeys = routes.flatMap((x) => x.children).map((x) => (x ? x.key ?? '' : ''));
    expect(parentKeys).toContain('org-management');
    expect(parentKeys).toContain('user-management');
    expect(parentKeys).toContain('location-management');
  });
});
