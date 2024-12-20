import {
  ConfigState,
  LanguageCode,
  ProjectCode,
  setAllConfigs,
  getAllConfigs,
  clientIdConfig,
} from '@opensrp/pkg-config';
import {
  BACKEND_ACTIVE,
  KEYCLOAK_API_BASE_URL,
  LANGUAGE_CODE,
  OPENSRP_API_BASE_URL,
  PROJECT_CODE,
  FHIR_API_BASE_URL,
  DEFAULTS_TABLE_PAGE_SIZE,
  PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY,
  AUTHZ_STRATEGY,
  COMMODITIES_LIST_RESOURCE_ID,
  FHIR_INVENTORY_LIST_ID,
  OPENSRP_CLIENT_ID,
} from './env';
import { URL_BACKEND_LOGIN, URL_REACT_LOGIN } from '../constants';

export const APP_LOGIN_URL = BACKEND_ACTIVE ? URL_BACKEND_LOGIN : URL_REACT_LOGIN;

const defaultvalues = getAllConfigs();

const configObject: ConfigState = {
  ...defaultvalues,
  [clientIdConfig]: OPENSRP_CLIENT_ID,
  languageCode: LANGUAGE_CODE as LanguageCode,
  projectCode: PROJECT_CODE as ProjectCode,
  appLoginURL: APP_LOGIN_URL,
  keycloakBaseURL: KEYCLOAK_API_BASE_URL,
  opensrpBaseURL: OPENSRP_API_BASE_URL,
  fhirBaseURL: FHIR_API_BASE_URL,
  defaultTablesPageSize: DEFAULTS_TABLE_PAGE_SIZE,
  practToOrgAssignmentStrategy: PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY,
  rbacStrategy: AUTHZ_STRATEGY,
  productListId: COMMODITIES_LIST_RESOURCE_ID,
  inventoryListId: FHIR_INVENTORY_LIST_ID,
};

setAllConfigs(configObject);
