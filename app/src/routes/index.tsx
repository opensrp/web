import { DashboardOutlined, IdcardOutlined } from '@ant-design/icons';
import UploadIcon from '@2fd/ant-design-icons/lib/Upload';
import {
  ENABLE_HEALTHCARE_SERVICES,
  ENABLE_FHIR_GROUP,
  ENABLE_PATIENTS_MODULE,
  ENABLE_FHIR_CARE_TEAM,
  ENABLE_QUEST,
  ENABLE_TEAMS_ASSIGNMENT_MODULE,
  ENABLE_FHIR_COMMODITY,
} from '../configs/env';
import {
  URL_USER,
  URL_LOCATION_UNIT,
  URL_TEAMS,
  URL_TEAM_ASSIGNMENT,
  URL_USER_GROUPS,
  URL_USER_ROLES,
  URL_FHIR_CARE_TEAM,
} from '../constants';
import { URL_ALL_LOCATIONS, URL_SERVICE_POINT_LIST } from '@opensrp/fhir-location-management';
import { QUEST_VIEW_URL } from '@opensrp/fhir-views';
import type { TFunction } from '@opensrp/i18n';
import { LIST_HEALTHCARE_URL } from '@opensrp/fhir-healthcare-service';
import { LIST_COMMODITY_URL, LIST_GROUP_URL } from '@opensrp/fhir-group-management';
import { LIST_PATIENTS_URL } from '@opensrp/fhir-client';
import {
  COMPOSITE_ENABLE_LOCATIONS_MANAGEMENT,
  COMPOSITE_ENABLE_TEAM_MANAGEMENT,
  COMPOSITE_ENABLE_USER_MANAGEMENT,
} from '../configs/settings';
import React from 'react';
import { UserRole } from '@opensrp/rbac/dist/types/roleDefinition';
import { getConfig, eusmProjectCode } from '@opensrp/pkg-config';
import { DATA_IMPORT_LIST_URL } from '@opensrp/fhir-import';

/** Interface for menu items */
export interface Route {
  key: string;
  enabled?: boolean;
  url?: string;
  title: string;
  isHomePageLink?: boolean;
  otherProps?: {
    icon?: string | JSX.Element;
  };
  permissions?: string[];
  children?: Route[];
}

export interface GetRoutes {
  (roles: string[], t: TFunction, userRole: UserRole): Route[];
}

/** Gets Routes For Application
 *
 * @param roles User's roles
 * @returns {Route[]} returns generated routes
 */
export function getRoutes(roles: string[], t: TFunction, userRole: UserRole): Route[] {
  const routes: Route[] = [
    {
      otherProps: { icon: <DashboardOutlined /> },
      title: t('Administration'),
      key: 'admin',
      enabled: true,
      permissions: [],
      children: [
        {
          title: t('User Management'),
          key: 'user-management',
          isHomePageLink: true,
          url: URL_USER,
          permissions: ['iam_user.read'],
          enabled: COMPOSITE_ENABLE_USER_MANAGEMENT,
          children: [
            { title: t('Users'), key: 'users', url: URL_USER, permissions: ['iam_user.read'] },
            {
              title: t('User Groups'),
              key: 'user-groups',
              url: URL_USER_GROUPS,
              permissions: ['iam_group.read'],
            },
            {
              title: t('User Roles'),
              key: 'user-roles',
              url: URL_USER_ROLES,
              permissions: ['iam_role.read'],
            },
          ],
        },
        {
          title: t('Location Management'),
          key: 'location-management',
          isHomePageLink: true,
          url: URL_LOCATION_UNIT,
          permissions: ['Location.read'],
          enabled: COMPOSITE_ENABLE_LOCATIONS_MANAGEMENT,
          children: [
            {
              title: t('Hierarchy'),
              url: URL_LOCATION_UNIT,
              key: 'location-unit',
              permissions: ['Location.read'],
            },
            {
              title: t('All Locations'),
              url: URL_ALL_LOCATIONS,
              key: 'all-locations',
              permissions: ['Location.read'],
            },
          ],
        },
        {
          title: t('Service Points Inventory'),
          key: 'service-points-inventory',
          isHomePageLink: true,
          url: URL_SERVICE_POINT_LIST,
          permissions: ['Location.read', 'Group.read'],
          enabled:
            COMPOSITE_ENABLE_LOCATIONS_MANAGEMENT && getConfig('projectCode') === eusmProjectCode,
        },
        {
          title: t('Care Teams Management'),
          key: 'fhir-care-team',
          isHomePageLink: true,
          permissions: ['CareTeam.read'],
          enabled: ENABLE_FHIR_CARE_TEAM,
          url: URL_FHIR_CARE_TEAM,
        },
        {
          title: t('Organization Management'),
          key: 'org-management',
          isHomePageLink: true,
          permissions: ['Organization.read'],
          url: URL_TEAMS,
          enabled: COMPOSITE_ENABLE_TEAM_MANAGEMENT,
          children: [
            {
              title: t('Organizations'),
              url: URL_TEAMS,
              key: 'ORGS',
              permissions: ['Organization.read'],
            },
            {
              permissions: ['OrganizationAffiliation.read', 'Location.read'],
              title: t('Organization Assignment'),
              url: URL_TEAM_ASSIGNMENT,
              key: 'org-assignment',
              enabled: ENABLE_TEAMS_ASSIGNMENT_MODULE,
            },
          ],
        },
        {
          title: t('Group Management'),
          key: 'fhir-group',
          url: LIST_GROUP_URL,
          isHomePageLink: true,
          permissions: ['Group.read'],
          enabled: ENABLE_FHIR_GROUP,
        },
        {
          title: t('Commodity Management'),
          key: 'fhir-commodity',
          isHomePageLink: true,
          url: LIST_COMMODITY_URL,
          permissions: ['Group.read'],
          enabled: ENABLE_FHIR_COMMODITY,
        },
        {
          title: t('Questionnaire Management'),
          key: 'fhir-quest',
          permissions: ['Questionnaire.read'],
          enabled: ENABLE_QUEST,
          url: QUEST_VIEW_URL,
          isHomePageLink: true,
        },
        {
          title: t('Healthcare Services'),
          key: 'healthcare',
          isHomePageLink: true,
          url: LIST_HEALTHCARE_URL,
          permissions: ['HealthcareService.read'],
          enabled: ENABLE_HEALTHCARE_SERVICES,
        },
      ],
    },
    {
      otherProps: { icon: <IdcardOutlined /> },
      title: t('Patients'),
      key: 'fhir-patients',
      permissions: ['Patient.read'],
      enabled: ENABLE_PATIENTS_MODULE,
      url: LIST_PATIENTS_URL,
      isHomePageLink: true,
    },
    {
      otherProps: { icon: <UploadIcon /> },
      title: t('Data Imports'),
      key: 'data-import',
      enabled: true,
      permissions: ['DataImport.read'],
      url: DATA_IMPORT_LIST_URL,
      isHomePageLink: true,
    },
  ];

  return filterFalsyRoutes(routes, userRole);
}

/** Removes the disabled Routes from
 *
 * @param routes all routes
 * @returns {Route[]} returns only enabled routes
 */
export function filterFalsyRoutes(routes: Route[], userRole: UserRole): Route[] {
  return routes
    .filter(
      (e) =>
        (!e.hasOwnProperty('enabled') || (e.hasOwnProperty('enabled') && e.enabled === true)) &&
        userRole.hasPermissions(e.permissions ?? [])
    )
    .map((e) => {
      return e.children ? { ...e, children: filterFalsyRoutes(e.children, userRole) } : e;
    });
}

export const getRoutesForHomepage: GetRoutes = (roles, t, userRole) => {
  const routes = getRoutes(roles, t, userRole);
  const homePageRoutes: Route[] = [];

  function extractHomePAgeLink(routes: Route[]) {
    for (const route of routes) {
      if (route.isHomePageLink) {
        homePageRoutes.push(route);
      }
      if (route.children) {
        extractHomePAgeLink(route.children);
      }
    }
  }

  extractHomePAgeLink(routes);
  return homePageRoutes;
};
