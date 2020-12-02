import { Dictionary } from '@onaio/utils';
import intersect from 'fast_array_intersect';
import { get, keyBy, values } from 'lodash';
import { AnyAction, Store } from 'redux';
import { createSelector } from 'reselect';
import SeamlessImmutable from 'seamless-immutable';
import { PlanDefinition } from '../plan-global-types';
import { descendingOrderSort, isPlanDefinitionOfType } from '../helpers/utils';

/** the reducer name */
export const reducerName = 'PlanDefinition';

/** list of plan types displayed
 * TODO: To be moved to env
 */
export const DISPLAYED_PLAN_TYPES = 'FI,IRS,MDA,MDA-Point,Dynamic-FI,Dynamic-IRS,Dynamic-MDA';

// actions

/** PLAN_DEFINITION_FETCHED action type */
export const PLAN_DEFINITIONS_FETCHED =
  'reveal/reducer/opensrp/PlanDefinition/PLAN_DEFINITIONS_FETCHED';

/** PLAN_DEFINITION_FETCHED action type */
export const REMOVE_PLAN_DEFINITIONS =
  'reveal/reducer/opensrp/PlanDefinition/REMOVE_PLAN_DEFINITIONS';

/** PLAN_DEFINITION_FETCHED action type */
export const ADD_PLAN_DEFINITION = 'reveal/reducer/opensrp/PlanDefinition/ADD_PLAN_DEFINITION';

/** interface for plan Objects */
/** Enum representing the possible intervention types */
export enum PlanStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
  DRAFT = 'draft',
  RETIRED = 'retired',
}
/** Enum representing the possible intervention types */
export enum InterventionType {
  DynamicFI = 'Dynamic-FI',
  DynamicIRS = 'Dynamic-IRS',
  DynamicMDA = 'Dynamic-MDA',
  FI = 'FI',
  IRS = 'IRS',
  IRSLite = 'IRS-Lite',
  MDA = 'MDA',
  MDAPoint = 'MDA-Point',
  SM = 'SM',
}
/** interface for fetch PlanDefinitions action */
export interface FetchPlanDefinitionsAction extends AnyAction {
  planDefinitionsById: { [key: string]: PlanDefinition };
  type: typeof PLAN_DEFINITIONS_FETCHED;
}

/** interface for removing PlanDefinitions action */
export interface RemovePlanDefinitionsAction extends AnyAction {
  planDefinitionsById: { [key: string]: PlanDefinition };
  type: typeof REMOVE_PLAN_DEFINITIONS;
}

/** interface for adding a single PlanDefinitions action */
export interface AddPlanDefinitionAction extends AnyAction {
  planObj: PlanDefinition;
  type: typeof ADD_PLAN_DEFINITION;
}

/** Create type for PlanDefinition reducer actions */
export type PlanDefinitionActionTypes =
  | FetchPlanDefinitionsAction
  | RemovePlanDefinitionsAction
  | AddPlanDefinitionAction
  | AnyAction;

// action creators

/**Fetch Plan Definitions action creator
 *
 * @param {PlanDefinition[]} planList - list of plan definition objects
 * @returns {FetchPlanDefinitionsAction} - returns fetch plandefinition action
 */
export const fetchPlanDefinitions = (
  planList: PlanDefinition[] = []
): FetchPlanDefinitionsAction => ({
  planDefinitionsById: keyBy(planList, 'identifier'),
  type: PLAN_DEFINITIONS_FETCHED,
});

/** Reset plan definitions state action creator
 *
 * @returns {object} -returns the reset plan definitions
 */
export const removePlanDefinitions = () => ({
  planDefinitionsById: {},
  type: REMOVE_PLAN_DEFINITIONS,
});

/**Add one Plan Definition action creator
 *
 * @param {PlanDefinition} planObj - the plan definition object
 * @returns {AddPlanDefinitionAction} returns add plandefinition action
 */
export const addPlanDefinition = (planObj: PlanDefinition): AddPlanDefinitionAction => ({
  planObj,
  type: ADD_PLAN_DEFINITION,
});

// the reducer

/** interface for PlanDefinition state */
interface PlanDefinitionState {
  planDefinitionsById: { [key: string]: PlanDefinition } | {};
}

/** immutable PlanDefinition state */
export type ImmutablePlanDefinitionState = PlanDefinitionState &
  SeamlessImmutable.ImmutableObject<PlanDefinitionState>;

/** initial PlanDefinition state */
const initialState: ImmutablePlanDefinitionState = SeamlessImmutable({
  planDefinitionsById: {},
});

/**
 * the plans reducer function
 *
 * @param {object} state - plans states
 * @param {object} action - plans actions
 * @returns {object} - the updated states
 */
export default function reducer(
  state = initialState,
  action: PlanDefinitionActionTypes
): ImmutablePlanDefinitionState {
  switch (action.type) {
    case PLAN_DEFINITIONS_FETCHED:
      return SeamlessImmutable({
        ...state,
        planDefinitionsById: { ...state.planDefinitionsById, ...action.planDefinitionsById },
      });
    case ADD_PLAN_DEFINITION:
      return SeamlessImmutable({
        ...state,
        planDefinitionsById: {
          ...state.planDefinitionsById,
          [action.planObj.identifier as string]: action.planObj,
        },
      });
    case REMOVE_PLAN_DEFINITIONS:
      return SeamlessImmutable({
        ...state,
        planDefinitionsById: action.planDefinitionsById,
      });
    default:
      return state;
  }
}

// selectors

/** get PlanDefinitions by id
 *
 * @param {object} state - the redux store
 * @param {InterventionType | null} interventionType - the PlanDefinition intervention Type
 * @returns {object}  PlanDefinitions by id
 */
export function getPlanDefinitionsById(
  state: Partial<Store>,
  interventionType: InterventionType | null = null
): { [key: string]: PlanDefinition } {
  if (interventionType) {
    return keyBy(getPlanDefinitionsArray(state, interventionType), 'identifier');
  }
  return (state as Dictionary)[reducerName].planDefinitionsById;
}

/** get one PlanDefinition using its
 *
 * @param {object} state - the redux store
 * @param {string} id - the PlanDefinition id
 * @returns {PlanDefinition|null} a PlanDefinition object or null
 */
export function getPlanDefinitionById(state: Partial<Store>, id: string): PlanDefinition | null {
  return get((state as Dictionary)[reducerName].planDefinitionsById, id, null);
}

/** get an array of PlanDefinition objects
 *
 * @param {object} state - the redux store
 * @param {InterventionType | null} interventionType - the PlanDefinition intervention Type
 * @returns {PlanDefinition[]} an array of PlanDefinition objects
 */
export function getPlanDefinitionsArray(
  state: Partial<Store>,
  interventionType: InterventionType | null = null
): PlanDefinition[] {
  const result = values((state as Dictionary)[reducerName].planDefinitionsById);
  if (interventionType) {
    return result.filter((e: PlanDefinition) => isPlanDefinitionOfType(e, interventionType));
  }
  return result;
}

/** RESELECT USAGE STARTS HERE */

/** This interface represents the structure of plan definition filter options/params */
export interface PlanDefinitionFilters {
  title?: string /** plan object title */;
  planIds?: string[] | null /** return only plans whose id appear here */;
}

/** planDefinitionsByIdBaseSelector selects store slice object with of all plans
 *
 * @param {string} planKey get plans by id
 * @returns {Dictionary<PlanDefinition>} plan definition by base selector
 */
export const planDefinitionsByIdBaseSelector = (planKey?: string) => (
  state: Partial<Store>
): Dictionary<PlanDefinition> =>
  (state as Dictionary)[reducerName][planKey ? planKey : 'planDefinitionsById'];

/** planDefinitionsArrayBaseSelector select an array of all plans
 *
 * @param {string} planKey get plans by id
 * @returns {PlanDefinition[]} - plan definitions in an array
 */
export const planDefinitionsArrayBaseSelector = (planKey?: string) => (
  state: Partial<Store>
): PlanDefinition[] =>
  values((state as Dictionary)[reducerName][planKey ? planKey : 'planDefinitionsById']);

/** Gets title from PlanFilters
 *
 * @param {object} _ - the redux store
 * @param {object} props - the plan filters object
 * @returns {string} return title
 */
export const getTitle = (_: Partial<Store>, props: PlanDefinitionFilters) => props.title;

/** Gets planIds from PlanFilters
 *
 * @param {object} _ - the redux store
 * @param {object} props - the plan filters object
 * @returns {string} return title
 */
export const getPlanIds = (_: Partial<Store>, props: PlanDefinitionFilters) => props.planIds;

/** Gets an array of Plan objects filtered by plan title
 *
 * @param {string} planKey - plan identifier
 * @returns {Function} returns createSelector method
 */
export const getPlanDefinitionsArrayByTitle = (planKey?: string) =>
  createSelector([planDefinitionsArrayBaseSelector(planKey), getTitle], (plans, title) =>
    title ? plans.filter((plan) => plan.title.toLowerCase().includes(title.toLowerCase())) : plans
  );

/** get plans for the given planIds
 *
 * @param {string} planKey - plan identifier
 * @returns {Function} returns createSelector method
 */
export const getPlanDefinitionsArrayByPlanIds = (planKey?: string) => {
  return createSelector(
    planDefinitionsByIdBaseSelector(planKey),
    planDefinitionsArrayBaseSelector(planKey),
    getPlanIds,
    (plansByIds, allPlans, planIds) => {
      const plansOfInterest = planIds ? planIds.map((planId) => plansByIds[planId]) : allPlans;
      return plansOfInterest;
    }
  );
};

/**filters plan definitions based on intervention type
 *
 * @param {PlanDefinition} plans - plans to filter
 * @param {string[]} filters - list of intervention types to filter against
 * @returns {PlanDefinition[]} - returns plans filetred by interventiontype
 */
export const FilterPlanDefinitionsByInterventionType = (
  plans: PlanDefinition[],
  filters: string = DISPLAYED_PLAN_TYPES
) => {
  return plans.filter(
    (plan) =>
      plan.useContext.filter(
        (context) =>
          context.code === 'interventionType' && filters.includes(context.valueCodableConcept)
      ).length > 0
  );
};

/** Gets an array of Plan objects filtered by intervention type
 *
 * @param {string} planKey - plan identifier
 * @returns {Function} returns createSelector method
 */
export const getPlanDefinitionsArrayByInterventionType = (planKey?: string) => {
  return createSelector(planDefinitionsArrayBaseSelector(planKey), (plans) =>
    FilterPlanDefinitionsByInterventionType(plans)
  );
};

/** makePlanDefinitionsArraySelector
 * Returns a selector that gets an array of IRSPlan objects filtered by one or all
 * of the following:
 *    - title
 *    - planIds
 *
 * These filter params are all optional and are supplied via the prop parameter.
 *
 * This selector is meant to be a memoized replacement for getPlanDefinitionsArray.
 *
 * To use this selector, do something like:
 *    const PlanDefinitionsArraySelector = makeIRSPlansArraySelector();
 *
 * @param {string} planKey - plan identifier
 * @param {string} sortField - sort by field
 * @returns {Function} returns createSelector method
 */
export const makePlanDefinitionsArraySelector = (
  planKey?: keyof PlanDefinitionState,
  sortField?: keyof PlanDefinition
) => {
  return createSelector(
    [
      getPlanDefinitionsArrayByInterventionType(planKey),
      getPlanDefinitionsArrayByTitle(planKey),
      getPlanDefinitionsArrayByPlanIds(planKey),
    ],
    (plans1, plans2, plans3) => {
      let finalPlans = intersect([plans1, plans2, plans3], JSON.stringify);
      if (sortField) {
        finalPlans = descendingOrderSort(finalPlans, sortField);
      }
      return finalPlans;
    }
  );
};
