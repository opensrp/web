import { Dictionary } from '@onaio/utils';
import { AnyAction, Store } from 'redux';
import SeamlessImmutable from 'seamless-immutable';
/** creates a union types that correctly matches against keys belonging to Obj whose value is of type keyType */
export declare type KeysWhoseValuesAreType<Obj, KeyType> = {
<<<<<<< HEAD
  [K in keyof Obj]: Obj[K] extends KeyType ? K : never;
=======
    [K in keyof Obj]: Obj[K] extends KeyType ? K : never;
>>>>>>> master
}[keyof Obj];
export declare type ItemsIdFieldType<T> = KeysWhoseValuesAreType<T, string | number>;
/** FETCHED action type */
export declare let FETCHED: string;
/** REMOVE action type */
export declare let REMOVE: string;
/** SET_TOTAL_RECORDS action type */
export declare let SET_TOTAL_RECORDS: string;
/** interface for authorize action
 *  generic type - object type being handled by this function
 */
export interface FetchAction<ObjectType> extends AnyAction {
<<<<<<< HEAD
  objectsById: Dictionary<ObjectType>;
  type: typeof FETCHED;
  reducerName: string;
}
/** Interface for removeAction */
export interface RemoveAction extends AnyAction {
  objectsById: Record<string, unknown>;
  type: typeof REMOVE;
  reducerName: string;
}
/** Interface for setTotalRecordsAction */
export interface SetTotalRecordsAction extends AnyAction {
  totalRecords: number;
  type: typeof SET_TOTAL_RECORDS;
  reducerName: string;
}
/** Create type for objects reducer actions */
export declare type ItemsActionTypes<ObjectType> =
  | FetchAction<ObjectType>
  | RemoveAction
  | AnyAction;
=======
    objectsById: Dictionary<ObjectType>;
    type: typeof FETCHED;
    reducerName: string;
}
/** Interface for removeAction */
export interface RemoveAction extends AnyAction {
    objectsById: Record<string, unknown>;
    type: typeof REMOVE;
    reducerName: string;
}
/** Interface for setTotalRecordsAction */
export interface SetTotalRecordsAction extends AnyAction {
    totalRecords: number;
    type: typeof SET_TOTAL_RECORDS;
    reducerName: string;
}
/** Create type for objects reducer actions */
export declare type ItemsActionTypes<ObjectType> = FetchAction<ObjectType> | RemoveAction | AnyAction;
>>>>>>> master
/** creates the action creator
 * ObjectType - generic type - object type being handled by this function
 *
 * @param {string} reducerName - generic name of reducer
 * @param {object} idField - key value whose value is more like an id for the objects,
 * this needs to be unique
 * @returns {function()} - the action creator
 */
<<<<<<< HEAD
export declare function fetchActionCreatorFactory<ObjectType>(
  reducerName: string,
  idField: ItemsIdFieldType<ObjectType>
): (objectsList?: ObjectType[]) => FetchAction<ObjectType>;
=======
export declare function fetchActionCreatorFactory<ObjectType>(reducerName: string, idField: ItemsIdFieldType<ObjectType>): (objectsList?: ObjectType[]) => FetchAction<ObjectType>;
>>>>>>> master
/** removeAction action ; action creator factory
 *
 * @param {string} reducerName - name of reducer
 * @returns {function()} - the action creator
 */
export declare const removeActionCreatorFactory: (reducerName: string) => () => RemoveAction;
/**
 * creates actions to set total records
 *
 * @param {string} reducerName - generic name of the reducer
 * @returns {function()} - the action creator
 */
<<<<<<< HEAD
export declare function setTotalRecordsFactory(
  reducerName: string
): (totalCount: number) => SetTotalRecordsAction;
=======
export declare function setTotalRecordsFactory(reducerName: string): (totalCount: number) => SetTotalRecordsAction;
>>>>>>> master
/** interface for object state in redux store
 * ObjectType - generic type - objects type being handled by this function
 */
interface ObjectState<ObjectType> {
<<<<<<< HEAD
  objectsById: {
    [key: string]: ObjectType;
  };
  totalRecords: number;
=======
    objectsById: {
        [key: string]: ObjectType;
    };
    totalRecords: number;
>>>>>>> master
}
/** Create an immutable object state
 * ObjectType - generic type - object type being handled by this function
 */
<<<<<<< HEAD
export declare type ImmutableObjectState<ObjectType> = ObjectState<ObjectType> &
  SeamlessImmutable.ImmutableObject<ObjectState<ObjectType>>;
=======
export declare type ImmutableObjectState<ObjectType> = ObjectState<ObjectType> & SeamlessImmutable.ImmutableObject<ObjectState<ObjectType>>;
>>>>>>> master
/**
 * ObjectType - generic type - object type being handled by this function
 */
/**
 * factory function to create reducer
 *
 * @param {string} reducerName - generic reducer name
 * @param {string} fetchedActionType - custom value for action type FETCHED
 * @param {string} removeActionType - custom value for action type REMOVE
 * @param {string} setTotalRecordsActionType - custom value for action type SET_TOTAL_RECORDS
 * @returns {object} - the state
 */
<<<<<<< HEAD
export declare const reducerFactory: <ObjectType>(
  reducerName: string,
  fetchedActionType?: string,
  removeActionType?: string,
  setTotalRecordsActionType?: string
) => (
  state: ImmutableObjectState<ObjectType> | undefined,
  action: ItemsActionTypes<ObjectType>
) => ImmutableObjectState<ObjectType>;
=======
export declare const reducerFactory: <ObjectType>(reducerName: string, fetchedActionType?: string, removeActionType?: string, setTotalRecordsActionType?: string) => (state: ImmutableObjectState<ObjectType> | undefined, action: ItemsActionTypes<ObjectType>) => ImmutableObjectState<ObjectType>;
>>>>>>> master
/** factory function that creates selector
 *  ObjectType - generic type - object type being handled by this function
 *
 *  @param {string} reducerName - the reducerName
 *  @returns {function()} - function that returns the state
 */
<<<<<<< HEAD
export declare const getItemsByIdFactory: <ObjectType>(
  reducerName: string
) => (state: Partial<Store<any, AnyAction>>) => Dictionary<ObjectType>;
=======
export declare const getItemsByIdFactory: <ObjectType>(reducerName: string) => (state: Partial<Store<any, AnyAction>>) => Dictionary<ObjectType>;
>>>>>>> master
/** factory function that creates selector
 *
 * @param {string} reducerName - name of the reducer
 * @returns {function()} - an array of object type being handled by this function
 */
<<<<<<< HEAD
export declare const getItemsArrayFactory: <ObjectType>(
  reducerName: string
) => (state: Partial<Store<any, AnyAction>>) => ObjectType[];
=======
export declare const getItemsArrayFactory: <ObjectType>(reducerName: string) => (state: Partial<Store<any, AnyAction>>) => ObjectType[];
>>>>>>> master
/** factory function that creates selector
 *
 * @param {string} reducerName -  name of reducer
 * @returns {function()} - object type being handled by this function
 */
<<<<<<< HEAD
export declare const getItemByIdFactory: <ObjectType>(
  reducerName: string
) => (state: Partial<Store<any, AnyAction>>, id: string) => ObjectType | null;
=======
export declare const getItemByIdFactory: <ObjectType>(reducerName: string) => (state: Partial<Store<any, AnyAction>>, id: string) => ObjectType | null;
>>>>>>> master
/** factory function that creates selector
 *
 * @param {string} reducerName -  name of reducer
 * @returns {function()} - function that returns the total number of records
 */
<<<<<<< HEAD
export declare const getTotalRecordsFactory: (
  reducerName: string
) => (state: Partial<Store<any, AnyAction>>) => number;
=======
export declare const getTotalRecordsFactory: (reducerName: string) => (state: Partial<Store<any, AnyAction>>) => number;
>>>>>>> master
export {};
