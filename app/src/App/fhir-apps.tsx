import React from 'react';
import {
  Resource404,
  PrivateRoute as PrivateComponent,
  PublicComponent,
} from '@opensrp/react-utils';
import {
  AuthorizationGrantType,
  ConnectedOauthCallback,
  getOpenSRPUserInfo,
  RouteParams,
  useOAuthLogin,
  OauthCallbackProps,
} from '@onaio/gatekeeper';
import ConnectedPrivateRoute from '@onaio/connected-private-route';
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router';
import { Spin } from 'antd';
import { CustomLogout } from '../components/Logout';
import { BACKEND_ACTIVE, DISABLE_LOGIN_PROTECTION } from '../configs/env';
import {
  REACT_CALLBACK_PATH,
  URL_BACKEND_CALLBACK,
  BACKEND_CALLBACK_PATH,
  URL_REACT_LOGIN,
  URL_LOGOUT,
  URL_LOCATION_UNIT,
  URL_HOME,
  URL_TEAMS_EDIT,
  URL_TEAMS_ADD,
  URL_TEAMS,
  URL_LOCATION_UNIT_ADD,
  URL_LOCATION_UNIT_EDIT,
  URL_USER_GROUPS,
  URL_USER_ROLES,
  URL_FHIR_CARE_TEAM,
  URL_TEAM_ASSIGNMENT,
} from '../constants';
import { providers } from '../configs/settings';
import CustomConnectedAPICallBack from '../components/page/CustomCallback';
import { PatientsList, PatientDetails, LIST_PATIENTS_URL } from '@opensrp/fhir-client';
import {
  UserCredentials,
  UserGroupsList,
  UserRolesList,
  URL_USER,
  URL_USER_EDIT,
  ROUTE_PARAM_USER_ID,
  ROUTE_PARAM_USERNAME,
  ROUTE_PARAM_USER_GROUP_ID,
  URL_USER_GROUP_EDIT,
  URL_USER_GROUP_CREATE,
  URL_USER_CREATE,
  URL_USER_CREDENTIALS,
  CreateEditUserGroup,
} from '@opensrp/user-management';
import {
  CareTeamList,
  ROUTE_PARAM_CARE_TEAM_ID,
  CreateEditCareTeam,
  URL_CREATE_CARE_TEAM,
  URL_EDIT_CARE_TEAM,
} from '@opensrp/fhir-care-team';
import {
  CreateEditUser as FHIRConnectedCreateEditUser,
  UserList as FhirUserList,
  USER_DETAILS_URL,
  UserDetailsV2,
} from '@opensrp/fhir-user-management';
import { Home } from '../containers/pages/Home/Home';
import {
  HealthCareList,
  HealthCareAddEdit,
  LIST_HEALTHCARE_URL,
  ADD_EDIT_HEALTHCARE_SERVICE_URL,
} from '@opensrp/fhir-healthcare-service';
import {
  OrganizationList as FhirTeamsList,
  AddEditOrganization as FhirTeamsAddEdit,
  AffiliationList as FhirTeamAssignment,
} from '@opensrp/fhir-team-management';
import {
  EusmAddEditLocationUnit,
  LocationUnitList as FHIRLocationUnitList,
  NewEditLocationUnit as FHIRNewEditLocationUnit,
  URL_SERVICE_POINT_ADD_EDIT,
  URL_SERVICE_POINT_LIST,
  URL_LOCATION_VIEW_DETAILS,
  ViewDetails,
  AllLocationListFlat as ListAllLocationsFlat,
  URL_ALL_LOCATIONS,
  EusmLocationListFlat,
} from '@opensrp/fhir-location-management';
import {
  teamAffiliationProps,
  editLocationProps,
  newLocationUnitProps,
  locationUnitProps,
  usersListProps,
  teamManagementProps,
  patientProps,
  fhirCreateEditUserProps,
  commmodityProps,
  fhirCreateEditLocationProps,
} from './utils';
import './App.css';
import {
  QuestionnaireList,
  QuestionnaireResponseList,
  QUEST_VIEW_URL,
  QUEST_RESPONSE_VIEW_URL,
  qrListRouteKey,
  QUEST_FORM_VIEW_URL,
} from '@opensrp/fhir-views';
import { QuestRForm, resourceTypeParam, resourceIdParam } from '@opensrp/fhir-quest-form';
import {
  CommodityList,
  ADD_EDIT_COMMODITY_URL,
  CommodityAddEdit,
  GroupList,
  LIST_COMMODITY_URL,
  LIST_GROUP_URL,
  ADD_LOCATION_INVENTORY,
  AddLocationInventory,
} from '@opensrp/fhir-group-management';
import { CloseFlag, URL_CLOSE_FLAGS } from '@opensrp/fhir-flag';
import { useTranslation } from '../mls';
import '@opensrp/user-management/dist/index.css';
import { APP_LOGIN_URL } from '../configs/dispatchConfig';
import {
  DATA_IMPORT_CREATE_URL,
  ImportDetailViewDetails,
  DATA_IMPORT_DETAIL_URL,
  DATA_IMPORT_LIST_URL,
  DataImportList,
  StartDataImport,
} from '@opensrp/fhir-import';

/** Util function that renders Oauth2 callback components
 *
 * @param routeProps - Component route props object
 */

export const LoadingComponent = () => <Spin size="large" className="custom-spinner" />;
export const SuccessfulLoginComponent = () => {
  return <Redirect to="/" />;
};

export const CallbackComponent = (routeProps: RouteComponentProps<RouteParams>) => {
  const props = {
    SuccessfulLoginComponent,
    LoadingComponent,
    providers,
    oAuthUserInfoGetter: getOpenSRPUserInfo,
    ...routeProps,
    // ts bug - default props not working, ts asking for default props to be repassed https://github.com/microsoft/TypeScript/issues/31247
  } as unknown as OauthCallbackProps<RouteParams>;

  if (BACKEND_ACTIVE) {
    return <CustomConnectedAPICallBack {...routeProps} />;
  }

  return <ConnectedOauthCallback {...props} />;
};

const FHIRApps = () => {
  const APP_CALLBACK_URL = BACKEND_ACTIVE ? URL_BACKEND_CALLBACK : URL_REACT_LOGIN;
  const { IMPLICIT, AUTHORIZATION_CODE } = AuthorizationGrantType;
  const AuthGrantType = BACKEND_ACTIVE ? AUTHORIZATION_CODE : IMPLICIT;
  const APP_CALLBACK_PATH = BACKEND_ACTIVE ? BACKEND_CALLBACK_PATH : REACT_CALLBACK_PATH;
  const { OpenSRP } = useOAuthLogin({ providers, authorizationGrantType: AuthGrantType });

  useTranslation();

  return (
    <Switch>
      {/* tslint:disable jsx-no-lambda */}
      {/* Home Page view */}
      <ConnectedPrivateRoute
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_HOME}
        component={Home}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${QUEST_FORM_VIEW_URL}/:${resourceIdParam}/:${resourceTypeParam}`}
        permissions={['Questionnaire.read']}
        component={QuestRForm}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${QUEST_RESPONSE_VIEW_URL}/:${qrListRouteKey}`}
        permissions={['QuestionnaireResponse.read']}
        component={QuestionnaireResponseList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={QUEST_VIEW_URL}
        permissions={['Questionnaire.read']}
        component={QuestionnaireList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_USER_GROUPS}
        permissions={['iam_group.read']}
        component={UserGroupsList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={DATA_IMPORT_LIST_URL}
        permissions={['DataImport.read']}
        component={DataImportList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${DATA_IMPORT_CREATE_URL}`}
        permissions={['DataImport.create']}
        component={StartDataImport}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${DATA_IMPORT_DETAIL_URL}/:${'workflowId'}`}
        {...patientProps}
        permissions={['DataImport.read']}
        component={ImportDetailViewDetails}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${DATA_IMPORT_LIST_URL}/:${'workflowId'}`}
        {...patientProps}
        permissions={['DataImport.read']}
        component={DataImportList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={LIST_PATIENTS_URL}
        {...patientProps}
        permissions={['Patient.read']}
        component={PatientsList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${LIST_PATIENTS_URL}/:${'id'}`}
        {...patientProps}
        permissions={['Patient.read']}
        component={PatientDetails}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${LIST_PATIENTS_URL}/:${'id'}/:resourceType/:resourceId`}
        {...patientProps}
        permissions={['Patient.read']}
        component={PatientDetails}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_USER_ROLES}
        permissions={['iam_role.read']}
        component={UserRolesList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_USER}
        {...usersListProps}
        permissions={['iam_user.read']}
        component={FhirUserList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${USER_DETAILS_URL}/:id`}
        permissions={['iam_user.read']}
        component={UserDetailsV2}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_FHIR_CARE_TEAM}
        permissions={['CareTeam.read']}
        component={CareTeamList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_EDIT_CARE_TEAM}/:${ROUTE_PARAM_CARE_TEAM_ID}`}
        permissions={['CareTeam.update']}
        component={CreateEditCareTeam}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_CREATE_CARE_TEAM}
        permissions={['CareTeam.create']}
        component={CreateEditCareTeam}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_USER_EDIT}/:${ROUTE_PARAM_USER_ID}`}
        {...fhirCreateEditUserProps}
        permissions={['iam_user.update']}
        component={FHIRConnectedCreateEditUser}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_USER_GROUP_EDIT}/:${ROUTE_PARAM_USER_GROUP_ID}`}
        permissions={['iam_group.update']}
        component={CreateEditUserGroup}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_USER_GROUP_CREATE}
        permissions={['iam_group.create']}
        component={CreateEditUserGroup}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_USER_CREATE}
        {...fhirCreateEditUserProps}
        permissions={['iam_user.create']}
        component={FHIRConnectedCreateEditUser}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_USER_CREDENTIALS}/:${ROUTE_PARAM_USER_ID}/:${ROUTE_PARAM_USERNAME}`}
        permissions={['iam_user.update']}
        component={UserCredentials}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_TEAMS}
        permissions={['Organization.read']}
        component={FhirTeamsList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_TEAM_ASSIGNMENT}
        {...teamAffiliationProps}
        permissions={['OrganizationAffiliation.read', 'Location.read']}
        component={FhirTeamAssignment}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_TEAMS_ADD}
        {...teamManagementProps}
        permissions={['Organization.create']}
        component={FhirTeamsAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_TEAMS_EDIT}/:id`}
        {...teamManagementProps}
        permissions={['Organization.update']}
        component={FhirTeamsAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_TEAMS}/:id`}
        {...teamAffiliationProps}
        permissions={['OrganizationAffiliation.read']}
        component={FhirTeamsList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_LOCATION_UNIT}
        {...locationUnitProps}
        permissions={['Location.read']}
        component={FHIRLocationUnitList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_ALL_LOCATIONS}
        permissions={['Location.read']}
        component={ListAllLocationsFlat}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_SERVICE_POINT_LIST}
        permissions={['Location.read']}
        component={EusmLocationListFlat}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_LOCATION_UNIT_ADD}
        {...newLocationUnitProps}
        permissions={['Location.create']}
        component={FHIRNewEditLocationUnit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_SERVICE_POINT_ADD_EDIT}
        {...newLocationUnitProps}
        permissions={['Location.create']}
        component={EusmAddEditLocationUnit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_SERVICE_POINT_ADD_EDIT}/:id`}
        {...newLocationUnitProps}
        permissions={['Location.create']}
        component={EusmAddEditLocationUnit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_LOCATION_UNIT_EDIT}
        {...editLocationProps}
        permissions={['Location.update']}
        component={FHIRNewEditLocationUnit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_LOCATION_VIEW_DETAILS}/:id`}
        permissions={['Location.read']}
        component={ViewDetails}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${ADD_EDIT_HEALTHCARE_SERVICE_URL}/:id`}
        permissions={['HealthcareService.update']}
        component={HealthCareAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={ADD_EDIT_HEALTHCARE_SERVICE_URL}
        permissions={['HealthcareService.create']}
        component={HealthCareAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${LIST_HEALTHCARE_URL}/:id`}
        permissions={['HealthcareService.read']}
        component={HealthCareList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={LIST_HEALTHCARE_URL}
        permissions={['HealthcareService.read']}
        component={HealthCareList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${ADD_EDIT_COMMODITY_URL}/:id`}
        exact
        {...commmodityProps}
        permissions={['Group.read']}
        component={CommodityAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={ADD_EDIT_COMMODITY_URL}
        {...commmodityProps}
        exact
        permissions={['Group.create']}
        component={CommodityAddEdit}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${ADD_LOCATION_INVENTORY}/:servicePointId`}
        {...fhirCreateEditLocationProps}
        exact
        permissions={['Group.create']}
        component={AddLocationInventory}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${ADD_LOCATION_INVENTORY}/:servicePointId/:inventoryId`}
        {...fhirCreateEditLocationProps}
        exact
        permissions={['Group.create']}
        component={AddLocationInventory}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${LIST_GROUP_URL}/:id`}
        permissions={['Group.read']}
        component={GroupList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={LIST_GROUP_URL}
        permissions={['Group.read']}
        component={GroupList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={`${LIST_COMMODITY_URL}/:id`}
        {...commmodityProps}
        permissions={['Group.read']}
        component={CommodityList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        path={LIST_COMMODITY_URL}
        {...commmodityProps}
        permissions={['Group.read']}
        component={CommodityList}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_USER_GROUPS}/:${ROUTE_PARAM_USER_GROUP_ID}`}
        component={UserGroupsList}
        permissions={['iam_group.read']}
      />
      <PrivateComponent
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={`${URL_CLOSE_FLAGS}/:id`}
        permissions={['Flag.read']}
        component={CloseFlag}
      />
      <Route
        exact
        path={APP_LOGIN_URL}
        render={() => {
          window.location.href = OpenSRP;
          return <></>;
        }}
      />
      <PublicComponent exact path={APP_CALLBACK_PATH} component={CallbackComponent} />
      {/* tslint:enable jsx-no-lambda */}
      <ConnectedPrivateRoute
        redirectPath={APP_CALLBACK_URL}
        disableLoginProtection={DISABLE_LOGIN_PROTECTION}
        exact
        path={URL_LOGOUT}
        // tslint:disable-next-line: jsx-no-lambda
        component={CustomLogout}
      />
      <Route exact component={Resource404} />
    </Switch>
  );
};

export { FHIRApps };
