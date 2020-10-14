import { KeycloakUser } from '@opensrp/store';
/* eslint-disable @typescript-eslint/camelcase */

export const keycloakUsersArray: KeycloakUser[] = [
  {
    id: '97f36061-52fb-4474-88f2-fd286311ff1d',
    createdTimestamp: 1600843525533,
    username: 'mwalimu',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Benjamin',
    lastName: 'Mwalimu',
    email: 'dubdabasoduba@gmail.com',
    disableableCredentialTypes: [],
    requiredActions: ['UPDATE_PASSWORD'],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: '80385001-f385-42ec-8edf-8591dc181a54',
    createdTimestamp: 1600156374050,
    username: 'ona',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Ona',
    lastName: 'kenya',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: '520b579e-70e9-4ae9-b1f8-0775c605b8d2',
    createdTimestamp: 1599565616551,
    username: 'ona-admin',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Ona',
    lastName: 'Admin',
    email: 'test@onatest.com',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 1600329648,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    createdTimestamp: 1600156317992,
    username: 'opensrp',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Demo',
    lastName: 'kenya',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
];

export const keycloakUser = {
  id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
  createdTimestamp: 1600156317992,
  username: 'opensrp',
  enabled: true,
  totp: false,
  emailVerified: false,
  firstName: 'Demo',
  lastName: 'kenya',
  email: 'test@onatest.com',
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 0,
  access: {
    manageGroupMembership: true,
    view: true,
    mapRoles: true,
    impersonate: false,
    manage: true,
  },
};

export const OpenSRPAPIResponse = {
  oAuth2Data: {
    access_token: 'hunter2',
    expires_in: '3599',
    state: 'opensrp',
    token_type: 'bearer',
  },
  preferredName: 'Superset User',
  roles: ['Provider'],
  username: 'superset-user',
};
