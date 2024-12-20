import { Valueof } from './helpers/types';

export enum Permit {
  CREATE = 0b0001,
  READ = 0b0010,
  UPDATE = 0b0100,
  DELETE = 0b1000,
  MANAGE = 0b1111,
}

/** Resources that the web client understands */

/** Resources that relate with user self administration like deleting own account */
export const accountClientResources = [
  'account_user',
  'account_application',
  'account_group',
] as const;
export type AccountClientResources = typeof accountClientResources[number];

/** Resources that relate to the realm administration like managing other users accounts */
export const realmClientResources = ['iam_user', 'iam_realm', 'iam_group', 'iam_role'] as const;
export type RealmClientResources = typeof realmClientResources[number];

/**
 * fhir hapi Server resources that this web client is familiar with, thus we can enforce rbac for permissions on views that
 * deal with the below resource.
 */
export const fhirResources = [
  'Patient',
  'Practitioner',
  'PractitionerRole',
  'Group',
  'Organization',
  'OrganizationAffiliation',
  'HealthcareService',
  'Location',
  'Observation',
  'QuestionnaireResponse',
  'CareTeam',
  'PlanDefinition',
  'Questionnaire',
  'PractitionerDetail',
  'List',
  'Binary',
  'Condition',
  'Task',
  'Immunization',
  'Encounter',
  'Flag',
] as const;
export type FhirResources = typeof fhirResources[number];

/**
 * Roles for Situations where we have views that are not directly tied to any of the native fhir resources.
 * These are custom and only relevant for the web. These should also be defined and parsed in a similar design as
 * FhirResources
 */
export const webClientRoles = ['DataImport'] as const;
export type WebClientRoles = typeof webClientRoles[number];

export const allSupportedRoles = [
  ...fhirResources,
  ...accountClientResources,
  ...realmClientResources,
  ...webClientRoles,
];
export type AllSupportedRoles = typeof allSupportedRoles[number];

export type BinaryNumber = number;
export type PermitKey = keyof typeof Permit;
export type PermitKeyValues = Valueof<typeof Permit>;
export type ResourcePermitMap = Map<AllSupportedRoles, number>;
