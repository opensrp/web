import {
  A1,
  A2,
  B1,
  B2,
  ROUTINE,
  CASE_TRIGGERED,
  LOW_PRIORITY,
  MEDIUM_PRIORITY,
  HIGH_PRIORITIY,
  INTERVENTION_TYPE_CODE,
  FI_STATUS_CODE,
  FI_REASON_CODE,
  OPENSRP_EVENT_ID_CODE,
  CASE_NUMBER_CODE,
  TASK_GENERATION_STATUS_CODE,
  TEAM_ASSIGNMENT_STATUS_CODE,
  BCC_CODE,
  IRS_CODE,
  BEDNET_DISTRIBUTION_CODE,
  BLOOD_SCREENING_CODE,
  CASE_CONFIRMATION_CODE,
  RACD_REGISTER_FAMILY_CODE,
  LARVAL_DIPPING_CODE,
  MOSQUITO_COLLECTION_CODE,
  MDA_ADHERENCE_CODE,
  MDA_POINT_DISPENSE_CODE,
  MDA_POINT_ADVERSE_EFFECTS_CODE,
  PRODUCT_CHECK_CODE,
  RECORD_GPS_CODE,
  SERVICE_POINT_CHECK_CODE,
  DISABLED,
  FALSE,
  TRUE,
  IGNORE,
  INTERNAL,
  CASE_CONFIRMATION_ACTIVITY_CODE,
  FAMILY_REGISTRATION_ACTIVITY_CODE,
  BLOOD_SCREENING_ACTIVITY_CODE,
  BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  LARVAL_DIPPING_ACTIVITY_CODE,
  MOSQUITO_COLLECTION_ACTIVITY_CODE,
  BCC_ACTIVITY_CODE,
  IRS_ACTIVITY_CODE,
  MDA_POINT_DISPENSE_ACTIVITY_CODE,
  MDA_POINT_ADVERSE_EFFECTS_ACTIVITY_CODE,
  DYNAMIC_FAMILY_REGISTRATION_ACTIVITY_CODE,
  DYNAMIC_BLOOD_SCREENING_ACTIVITY_CODE,
  DYNAMIC_BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  DYNAMIC_LARVAL_DIPPING_ACTIVITY_CODE,
  DYNAMIC_MOSQUITO_COLLECTION_ACTIVITY_CODE,
  DYNAMIC_BCC_ACTIVITY_CODE,
  DYNAMIC_IRS_ACTIVITY_CODE,
  DYNAMIC_MDA_COMMUNITY_DISPENSE_ACTIVITY_CODE,
  DYNAMIC_MDA_COMMUNITY_ADHERENCE_ACTIVITY_CODE,
  PRODUCT_CHECK_ACTIVITY_CODE,
  RECORD_GPS_ACTIVITY_CODE,
  SERVICE_POINT_CHECK_ACTIVITY_CODE,
  INVESTIGATION,
  LOOKS_GOOD_ACTIVITY_CODE,
  COMPLETE_FIX_PROBLEM_ACTIVITY_CODE,
  COMPLETE_FLAG_PROBLEM_ACTIVITY_CODE,
  COMPLETE_RECORD_GPS_ACTIVITY_CODE,
  COMPLETE_SERVICE_CHECK_ACTIVITY_CODE,
  LOOKS_GOOD_CODE,
  COMPLETE_FIX_PROBLEM_CODE,
  COMPLETE_FLAG_PROBLEM_CODE,
  COMPLETE_RECORD_GPS_CODE,
  COMPLETE_SERVICE_CHECK_CODE,
  COMPLETE_POINT_CHECK_WITH_PROBLEM_ACTIVITY_CODE,
  COMPLETE_POINT_CHECK_WITH_PROBLEM_CODE,
  BENEFICIARY_CONSULTATION_ACTIVITY_CODE,
  BENEFICIARY_CONSULTATION_CODE,
  WAREHOUSE_CHECK_CODE,
  COMPLETE_BENEFICIARY_CONSULTATION_ACTIVITY_CODE,
  COMPLETE_WAREHOUSE_CHECK_ACTIVITY_CODE,
  WAREHOUSE_CHECK_ACTVITY_CODE,
  COMPLETE_BENEFICIARY_FLAG_ACTIVITY_CODE,
  COMPLETE_BENEFICIARY_FLAG_CODE,
  COMPLETE_BENEFICIARY_CONSULTATION_CODE,
  COMPLETE_WAREHOUSE_CHECK_CODE,
  FIX_PRODUCT_PROBLEM_ACTIVITY_CODE,
  FIX_PRODUCT_PROBLEMS_CODE,
} from './stringConstants';

/** Enum representing the possible goal unitss */
export enum GoalUnit {
  ACTIVITY = 'activit(y|ies)',
  CASE = 'case(s)',
  PERCENT = 'Percent',
  PERSON = 'Person(s)',
  UNKNOWN = 'unknown',
}

/** Focus investigation configs */

/** Allowed FI Status values */
export const FIStatuses = [A1, A2, B1, B2] as const;

/** Allowed FI Status values */
export const FIReasons = [ROUTINE, CASE_TRIGGERED] as const;

/** Allowed goal priority values */
export const goalPriorities = [LOW_PRIORITY, MEDIUM_PRIORITY, HIGH_PRIORITIY] as const;

/** Allowed action Reason values */
export const actionReasons = [INVESTIGATION, ROUTINE] as const;

/** Allowed useContext Code values */
export const useContextCodes = [
  INTERVENTION_TYPE_CODE,
  FI_STATUS_CODE,
  FI_REASON_CODE,
  OPENSRP_EVENT_ID_CODE,
  CASE_NUMBER_CODE,
  TASK_GENERATION_STATUS_CODE,
  TEAM_ASSIGNMENT_STATUS_CODE,
] as const;

/** Plan activity code values */
export const PlanActionCodes = [
  BCC_CODE,
  IRS_CODE,
  BEDNET_DISTRIBUTION_CODE,
  BLOOD_SCREENING_CODE,
  CASE_CONFIRMATION_CODE,
  RACD_REGISTER_FAMILY_CODE,
  LARVAL_DIPPING_CODE,
  MOSQUITO_COLLECTION_CODE,
  MDA_ADHERENCE_CODE,
  MDA_POINT_DISPENSE_CODE,
  MDA_POINT_ADVERSE_EFFECTS_CODE,
  PRODUCT_CHECK_CODE,
  RECORD_GPS_CODE,
  SERVICE_POINT_CHECK_CODE,
  LOOKS_GOOD_CODE,
  COMPLETE_FIX_PROBLEM_CODE,
  COMPLETE_FLAG_PROBLEM_CODE,
  COMPLETE_RECORD_GPS_CODE,
  COMPLETE_SERVICE_CHECK_CODE,
  COMPLETE_POINT_CHECK_WITH_PROBLEM_CODE,
  BENEFICIARY_CONSULTATION_CODE,
  COMPLETE_BENEFICIARY_CONSULTATION_CODE,
  COMPLETE_BENEFICIARY_FLAG_CODE,
  WAREHOUSE_CHECK_CODE,
  COMPLETE_WAREHOUSE_CHECK_CODE,
  FIX_PRODUCT_PROBLEMS_CODE,
] as const;

/** Allowed taskGenerationStatus values */
export const taskGenerationStatuses = {
  [DISABLED]: DISABLED,
  [FALSE]: FALSE,
  [TRUE]: TRUE,
  [IGNORE]: IGNORE,
  [INTERNAL]: INTERNAL,
} as const;

/** Plan activity title values */
export const PlanActivityTitles = [
  CASE_CONFIRMATION_ACTIVITY_CODE,
  FAMILY_REGISTRATION_ACTIVITY_CODE,
  BLOOD_SCREENING_ACTIVITY_CODE,
  BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  LARVAL_DIPPING_ACTIVITY_CODE,
  MOSQUITO_COLLECTION_ACTIVITY_CODE,
  BCC_ACTIVITY_CODE,
  IRS_ACTIVITY_CODE,
  MDA_POINT_DISPENSE_ACTIVITY_CODE,
  MDA_POINT_ADVERSE_EFFECTS_ACTIVITY_CODE,
  DYNAMIC_FAMILY_REGISTRATION_ACTIVITY_CODE,
  DYNAMIC_BLOOD_SCREENING_ACTIVITY_CODE,
  DYNAMIC_BEDNET_DISTRIBUTION_ACTIVITY_CODE,
  DYNAMIC_LARVAL_DIPPING_ACTIVITY_CODE,
  DYNAMIC_MOSQUITO_COLLECTION_ACTIVITY_CODE,
  DYNAMIC_BCC_ACTIVITY_CODE,
  DYNAMIC_IRS_ACTIVITY_CODE,
  DYNAMIC_MDA_COMMUNITY_DISPENSE_ACTIVITY_CODE,
  DYNAMIC_MDA_COMMUNITY_ADHERENCE_ACTIVITY_CODE,
  PRODUCT_CHECK_ACTIVITY_CODE,
  RECORD_GPS_ACTIVITY_CODE,
  SERVICE_POINT_CHECK_ACTIVITY_CODE,
  LOOKS_GOOD_ACTIVITY_CODE,
  COMPLETE_FIX_PROBLEM_ACTIVITY_CODE,
  COMPLETE_FLAG_PROBLEM_ACTIVITY_CODE,
  COMPLETE_RECORD_GPS_ACTIVITY_CODE,
  COMPLETE_SERVICE_CHECK_ACTIVITY_CODE,
  COMPLETE_POINT_CHECK_WITH_PROBLEM_ACTIVITY_CODE,
  BENEFICIARY_CONSULTATION_ACTIVITY_CODE,
  COMPLETE_BENEFICIARY_CONSULTATION_ACTIVITY_CODE,
  COMPLETE_BENEFICIARY_FLAG_ACTIVITY_CODE,
  WAREHOUSE_CHECK_ACTVITY_CODE,
  COMPLETE_WAREHOUSE_CHECK_ACTIVITY_CODE,
  FIX_PRODUCT_PROBLEM_ACTIVITY_CODE,
] as const;

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

/** Enum representing the possible intervention types */
export enum PlanStatus {
  ACTIVE = 'active',
  COMPLETE = 'complete',
  DRAFT = 'draft',
  RETIRED = 'retired',
}
