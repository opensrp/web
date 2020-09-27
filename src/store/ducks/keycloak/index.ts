/** users ducks modules: actions, actionCreators, reducer and selectors */
import { Dictionary } from '@onaio/utils/dist/types/types';
import { keyBy, values } from 'lodash';
import intersect from 'fast_array_intersect';
import { AnyAction, Store } from 'redux';
import { createSelector, OutputParametricSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';

/** The reducer name */
export const reducerName = 'keycloakUsers';

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
  email: string;
  emailVerified?: boolean;
  enabled?: boolean;
  firstName: string;
  id: string;
  lastName: string;
  notBefore?: number;
  requiredActions?: string[];
  totp?: boolean;
  username: string;
}

// actions

/** action type for fetching keycloak users */
export const KEYCLOAK_USERS_FETCHED = 'keycloak/reducer/users/userS_FETCHED';
/** action type for removing keycloak users */
export const REMOVE_KEYCLOAK_USERS = 'keycloak/reducer/users/REMOVE_KEYCLOAK_USERS';

/** interface action to add users to store */
export interface FetchKeycloakUsersAction extends AnyAction {
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

/** Fetch users action creator
 * @param {user []} usersList - users array to add to store
 * @return {FetchKeycloakUsersAction} - an action to add users to redux store
 */
export const fetchKeycloakUsers = (usersList: KeycloakUser[] = []): FetchKeycloakUsersAction => {
  return {
    usersById: keyBy(usersList, (user: KeycloakUser) => user.id),
    type: KEYCLOAK_USERS_FETCHED,
  };
};

/** Remove users action creator */
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

/** the users reducer function */
export default function reducer(
  state: ImmutableKeycloakUsersState = initialState,
  action: KeycloakUsersActionTypes
): ImmutableKeycloakUsersState {
  switch (action.type) {
    case KEYCLOAK_USERS_FETCHED:
      return SeamlessImmutable({
        ...state,
        usersById: { ...state.usersById, ...action.usersById },
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
  id: string[] /** get all users whose ids appear in this array */;
  username?: string /** get users whose username includes text in the username field */;
}

// NON MEMOIZED SELECTORS

/**
 * Gets id from KeycloakUsersFilters
 * @param {Partial<Store>} state - the redux store
 * @param {KeycloakUsersFilters} props - the keycloak users filters object
 */
export const getUserIds = (_: Partial<Store>, props: KeycloakUsersFilters): string[] => props.id;
/**
 * Gets name from KeycloakUsersFilters
 * @param {Partial<Store>} state - the redux store
 * @param {KeycloakUsersFilters} props - the users filters object
 */
export const getUsername = (_: Partial<Store>, props: KeycloakUsersFilters): string | undefined =>
  props.username;
/** returns all users in the store as values whose keys are their respective ids
 * @param {Partial<Store>} state - the redux store
 * @return { { [key: string] : KeycloakUser} } - users object as values, respective ids as keys
 */
export function getKeycloakUsersById(state: Partial<Store>): { [key: string]: KeycloakUser } {
  return (state as Dictionary)[reducerName].usersById;
}

/** gets keycloak users as an array of user objects
 * @param {Partial<Store>} state - the redux store
 * @return {KeycloakUser[]} - an array of users objs
 */
export function getKeycloakUsersArray(state: Partial<Store>): KeycloakUser[] {
  return values(getKeycloakUsersById(state));
}

/**
 * Gets all practitioners whose name includes phrase given in name filter prop
 * @param {Partial<Store>} state - the redux store
 * @param {PractitionerFilters} props - the practitioners filters object
 */
export const getUsersByUsername = (): OutputParametricSelector<
  Partial<Store>,
  KeycloakUsersFilters,
  KeycloakUser[],
  (res1: KeycloakUser[], res2: string | undefined) => KeycloakUser[]
> =>
  createSelector(getKeycloakUsersArray, getUsername, (usersArray, username) =>
    username
      ? usersArray.filter((user: KeycloakUser) =>
          user.username.toLowerCase().includes(username.toLowerCase())
        )
      : usersArray
  );

// MEMOIZED SELECTORS

/**
 * Gets all users whose identifiers appear in ids filter prop value
 * @param {Partial<Store>} state - the redux store
 * @param {userFilters} props - the users filters object
 */
export const getKeycloakUsersByIds = (): OutputParametricSelector<
  Partial<Store>,
  KeycloakUsersFilters,
  KeycloakUser[],
  (
    res1: {
      [key: string]: KeycloakUser;
    },
    res2: string[],
    res3: KeycloakUser[]
  ) => KeycloakUser[]
> =>
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

/** practitioner array selector factory
 * aggregates response from all applied filters and returns results
 * @param {Partial<Store>} state - the redux store
 * @param {PractitionerFilters} props - the practitioners filters object
 */
export const makeKeycloakUsersSelector = (): OutputParametricSelector<
  Partial<Store>,
  KeycloakUsersFilters,
  KeycloakUser[],
  (res1: KeycloakUser[], res2: KeycloakUser[]) => KeycloakUser[]
> =>
  createSelector(getKeycloakUsersByIds(), getUsersByUsername(), (arr1, arr2) => {
    return intersect([arr1, arr2], JSON.stringify);
  });
