/** users ducks modules: actions, actionCreators, reducer and selectors */
import { Dictionary } from '@onaio/utils';
import { keyBy, values } from 'lodash';
import intersect from 'fast_array_intersect';
import { AnyAction, Store } from 'redux';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';

/** The reducer name */
export const reducerName = 'keycloakUsers';

/** Interface for UserGroup json object */
export interface UserGroup {
  id: string;
  name: string;
  path: string;
  subGroups?: UserGroup[];
}

/** Interface for practitioner json object */
export interface Practitioner {
  active: boolean;
  identifier: string;
  name: string;
  userId: string;
  username: string;
}

/** interface user action */
export interface UserAction {
  alias: string;
  name: string;
  providerId: string;
  enabled: boolean;
  defaultAction: boolean;
  priority: number;
  config: Dictionary;
}

export interface UserAttributes {
  // while these may be adhoc and arbitrary it carries with it serious back and cross compatibility issues, these should not be modified lightly
  contact?: string[];
  fhir_core_app_id?: string[];
  nationalId?: string;
  phoneNumber?: string;
}

/** Interface for user json object */
export interface KeycloakUser {
  access?: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
  createdTimestamp?: number;
  disableableCredentialTypes?: string[];
  email?: string;
  emailVerified?: boolean;
  enabled?: boolean;
  firstName?: string;
  id: string;
  lastName?: string;
  nationalId?: string;
  phoneNumber?: string;
  notBefore?: number;
  requiredActions?: string[];
  totp?: boolean;
  username: string;
  attributes?: UserAttributes;
}

// actions

/** action type for fetching keycloak users */
export const KEYCLOAK_USERS_FETCHED = 'keycloak/reducer/users/userS_FETCHED';
/** action type for removing keycloak users */
export const REMOVE_KEYCLOAK_USERS = 'keycloak/reducer/users/REMOVE_KEYCLOAK_USERS';

/** interface action to add users to store */
export interface FetchKeycloakUsersAction extends AnyAction {
  overwrite: boolean | undefined;
  usersById: Dictionary<KeycloakUser>;
  type: typeof KEYCLOAK_USERS_FETCHED;
}

/** Interface for removeusersAction */
export interface RemoveKeycloakUsersAction extends AnyAction {
  usersById: Dictionary<KeycloakUser>;
  type: typeof REMOVE_KEYCLOAK_USERS;
}

/** Create type for users reducer actions */
export type KeycloakUsersActionTypes =
  | FetchKeycloakUsersAction
  | RemoveKeycloakUsersAction
  | AnyAction;

// action Creators

/**
 * Fetch users action creator
 *
 * @param {Array} usersList - keycloak users
 * @param {boolean} overwrite - whether to replace records in store for users
 * @returns {object} - the dispatcher to remove the user
 */
export const fetchKeycloakUsers = (
  usersList: KeycloakUser[] = [],
  overwrite?: boolean
): FetchKeycloakUsersAction => {
  return {
    overwrite,
    usersById: keyBy(usersList, (user: KeycloakUser) => user.id),
    type: KEYCLOAK_USERS_FETCHED,
  };
};

/**
 * Remove users action creator
 *
 * @returns {object} - the dispatcher to remove the user
 */
export const removeKeycloakUsers = (): RemoveKeycloakUsersAction => {
  return {
    usersById: {},
    type: REMOVE_KEYCLOAK_USERS,
  };
};

// The reducer

/** interface for keycloak users state in redux store */
export interface KeycloakUsersState {
  usersById: Dictionary<KeycloakUser> | Dictionary;
}

/** Create an immutable keycloak users state */
export type ImmutableKeycloakUsersState = KeycloakUsersState &
  SeamlessImmutable.ImmutableObject<KeycloakUsersState>;

/** initial keycloak users state */
export const initialState: ImmutableKeycloakUsersState = SeamlessImmutable({
  usersById: {},
});

/**
 * the users reducer function
 *
 * @param {object} state - keycloak users states
 * @param {object} action - keycloak users actions
 * @returns {object} - the updated states
 */
export function reducer(
  state: ImmutableKeycloakUsersState = initialState,
  action: KeycloakUsersActionTypes
): ImmutableKeycloakUsersState {
  switch (action.type) {
    case KEYCLOAK_USERS_FETCHED:
      return SeamlessImmutable({
        ...state,
        usersById: action.overwrite
          ? { ...action.usersById }
          : { ...state.usersById, ...action.usersById },
      });
    case REMOVE_KEYCLOAK_USERS:
      return SeamlessImmutable({
        ...state,
        usersById: action.usersById,
      });

    default:
      return state;
  }
}

// Selectors

export interface KeycloakUsersFilters {
  id?: string[] /** get all users whose ids appear in this array */;
  username?: string /** get users whose username includes text in the username field */;
  searchText?: string /** filter user with given text */;
}

/**
 * Gets id from KeycloakUsersFilters
 *
 * @param _ - the redux store
 * @param props - the keycloak users filters object
 */
export const getUserIds = (_: Partial<Store>, props: KeycloakUsersFilters) => props.id;

/**
 * Gets name from KeycloakUsersFilters
 *
 * @param _ - the redux store
 * @param props - the users filters object
 */
export const getUsername = (_: Partial<Store>, props: KeycloakUsersFilters) => props.username;

/**
 * Gets searchText from filter props
 *
 * @param _ - the redux store
 * @param props - the users filters object
 */
export const getSearchText = (_: Partial<Store>, props: KeycloakUsersFilters) => props.searchText;

/**
 * returns all users in the store as values whose keys are their respective ids
 *
 * @param {any} state - the redux store
 * @returns {object} - users object as values, respective ids as keys
 */
export function getKeycloakUsersById(state: Partial<Store>): { [key: string]: KeycloakUser } {
  return (state as Dictionary)[reducerName].usersById;
}

/**
 * gets keycloak users as an array of user objects
 *
 * @param {any} state - the redux store
 * @returns {Array} - an array of users objs
 */
export function getKeycloakUsersArray(state: Partial<Store>): KeycloakUser[] {
  return values(getKeycloakUsersById(state));
}

export const getUsersByUsername = () =>
  /**
   * Gets all practitioners whose name includes phrase given in name filter prop
   *
   * @returns {Array} - practitioners whose name includes phrase given in name filter prop
   */
  createSelector(getKeycloakUsersArray, getUsername, (usersArray, username) =>
    username
      ? usersArray.filter((user: KeycloakUser) =>
          user.username.toLowerCase().includes(username.toLowerCase())
        )
      : usersArray
  );

export const getKeycloakUsersByIds = () =>
  /**
   * Gets all users whose identifiers appear in ids filter prop value
   *
   * @returns {Array} - users whose identifiers appear in ids filter prop value
   */
  createSelector(
    getKeycloakUsersById,
    getUserIds,
    getKeycloakUsersArray,
    (usersById, ids, usersArray) => {
      if (ids === undefined) {
        return usersArray;
      }
      if (ids.length > 0) {
        return ids.map((id: string) => usersById[id]);
      }
      return [];
    }
  );

const usersByIdsSelector = getKeycloakUsersByIds();
const usersByNameSelector = getUsersByUsername();

export const makeKeycloakUsersSelector = () =>
  /**
   * practitioner array selector factory
   * aggregates response from all applied filters and returns results
   *
   * @returns {Array} - aggregates response from all applied filters and returns results
   */
  createSelector(
    usersByIdsSelector,
    usersByNameSelector,
    getSearchText,
    (arr1, arr2, searchText) => {
      const unfilteredResults = intersect([arr1, arr2], JSON.stringify);
      const matchesUserName = (user: KeycloakUser) => {
        const fullName = `${user.firstName} ${user.lastName}`;
        if (!searchText) {
          return true;
        }
        return fullName.toLowerCase().includes(searchText.toLowerCase());
      };
      return unfilteredResults.filter((user) => matchesUserName(user));
    }
  );
