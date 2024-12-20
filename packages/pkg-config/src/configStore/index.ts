/** stores configuration for any other package */
import { createGlobalState } from 'react-hooks-global-state';
import { clientIdConfig, USER_PREFERENCE_KEY } from '../constants';
import { PaginationProps } from 'antd/lib/pagination/Pagination';

export const supportedLanguageCodes = ['en', 'sw', 'fr', 'ar', 'th', 'vi'] as const;

export const eusmProjectCode = 'eusm' as const;
export const coreProjectCode = 'core' as const;
export const echisProjectCode = 'echis' as const;
export const gizProjectCode = 'giz' as const;

export const supportedProjectCode = [
  eusmProjectCode,
  coreProjectCode,
  echisProjectCode,
  gizProjectCode,
] as const;
export const supportedRbacStrategies = ['keycloak'] as const;

export type LanguageCode = typeof supportedLanguageCodes[number];
export type ProjectCode = typeof supportedProjectCode[number];
export type KeycloakStrategies = typeof supportedRbacStrategies[number];
export type GlobalState = ConfigState & UserPreference;

export type PaginationState = Pick<PaginationProps, 'current' | 'pageSize'>;

export interface TableState {
  pagination?: PaginationState;
}

/** interface for configs for this package */
export interface ConfigState {
  [clientIdConfig]?: string;
  languageCode?: LanguageCode;
  projectCode?: ProjectCode;
  appLoginURL?: string;
  keycloakBaseURL?: string;
  opensrpBaseURL?: string;
  fhirBaseURL?: string;
  defaultTablesPageSize?: number; // static value of the default number of rows per page
  rbacStrategy?: KeycloakStrategies;
  practToOrgAssignmentStrategy?: PractToOrgAssignmentStrategy;
  productListId?: string;
  inventoryListId?: string;
}

export interface UserPreference {
  tablespref?: Record<string, TableState>;
}

/**
 * This strategy only applies unilaterally, i.e. from practitioner to organization.
 * It does not imply any relations in the opposite direction i.e. from organization
 * to practitioner.
 */
export enum PractToOrgAssignmentStrategy {
  ONE_TO_ONE = 'ONE_TO_ONE', // one practitioner assignable to one organization
  ONE_TO_MANY = 'ONE_TO_MANY', // one practitioner assignable to multiple organizations
}

const defaultConfigs: Partial<GlobalState> = {
  [clientIdConfig]: undefined,
  languageCode: 'en',
  appLoginURL: undefined,
  keycloakBaseURL: undefined,
  opensrpBaseURL: undefined,
  fhirBaseURL: undefined,
  tablespref: undefined,
  defaultTablesPageSize: 5,
  projectCode: 'core',
  rbacStrategy: 'keycloak',
  practToOrgAssignmentStrategy: PractToOrgAssignmentStrategy.ONE_TO_MANY,
  productListId: undefined,
  inventoryListId: undefined,
};

let localstorage: UserPreference = localStorage.getItem(USER_PREFERENCE_KEY)
  ? JSON.parse(localStorage.getItem(USER_PREFERENCE_KEY) as string)
  : {};

const { useGlobalState, getGlobalState, setGlobalState, ...unexposedGettersSetters } =
  createGlobalState<GlobalState>({ ...defaultConfigs, ...localstorage });

/**
 * hook to get and update values in the config store
 *
 * @example
 * import { useGlobalConfigs } from `'@opensrp/pkg-config'`;
 *
 * const Component = () => {
 *   const [language, setLanguage] = useGlobalConfigs('languageCode');
 *   ...
 * };
 */
const useGlobalConfigs = useGlobalState;

/**
 * function to get config values outside of React
 *
 * @example
 * import {getConfig} from `"@opensrp/pkg-config"`;
 *
 * const language = getConfig('languageCode');
 */
const getConfig = getGlobalState;

/**
 * function to set config values outside of React
 *
 * @param key name of the config to set
 * @param value value of the config to set
 * @example
 * import {setConfig} from `'@opensrp/pkg-config'`;
 *
 * const language = setConfig('languageCode', 'fr');
 */
function setConfig<T extends keyof GlobalState>(key: T, value: GlobalState[T]) {
  const newstate: GlobalState = {};
  newstate[key] = value;
  saveToLocal(newstate);
  setGlobalState(key, value);
}

/** these properties are part of useGlobalState but the exposed type interface does not include them */
const otherGettersSetters = unexposedGettersSetters as unknown as {
  getState: () => GlobalState;
  setState: (nextGlobalState: GlobalState) => void;
};

/**
 * function to get all config values outside of React
 *
 * @example
 * import {getAllConfigs} from `'@opensrp/pkg-config'`;
 *
 * const allConfigs = getAllConfigs();;
 */
const getAllConfigs = otherGettersSetters.getState;

/**
 * function to get all config values outside of React
 *
 * @param value Object for setting all config values
 * @example
 * import {setAllConfigs} from `'@opensrp/pkg-config'`;
 *
 * const configs = {
 *  languageCode: 'en',
 *  projectCode: 'core',
 * }
 *
 * const allConfigs = setAllConfigs(configs);
 */
function setAllConfigs(value: GlobalState) {
  saveToLocal(value);
  otherGettersSetters.setState(value);
}

/**
 * internal function to save Value to Local Storage for later retrival
 *
 * @param config config to save to local storage
 */
function saveToLocal(config: GlobalState) {
  localstorage = { tablespref: config.tablespref };
  localStorage.setItem(USER_PREFERENCE_KEY, JSON.stringify(localstorage));
}

export { useGlobalConfigs, getConfig, setConfig, getAllConfigs, setAllConfigs };
