import React from 'react';
import { Col, Row } from 'antd';
import { useQuery } from 'react-query';
import FHIR from 'fhirclient';
import { Spin } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps } from 'react-router-dom';
import { Dictionary } from '@onaio/utils';
import lang from '../../lang';
import {
  FHIR_CARE_TEAM,
  FHIR_GROUPS,
  FHIR_PRACTITIONERS,
  ROUTE_PARAM_CARE_TEAM_ID,
} from '../../constants';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { CareTeamForm } from './Form';
import { getPatientName } from './utils';

// Interface for route params
interface RouteParams {
  careTeamId: string;
}

/** props for editing a user view */
export interface EditCareTeamProps {
  fhirBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type CreateEditCareTeamProps = EditCareTeamProps & RouteComponentProps<RouteParams>;

/** default props for editing user component */
export const defaultEditCareTeamsProps: EditCareTeamProps = {
  fhirBaseURL: '',
};

/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditCareTeam: React.FC<CreateEditCareTeamProps> = (props: CreateEditCareTeamProps) => {
  const { fhirBaseURL } = props;
  const careTeamId = props.match.params[ROUTE_PARAM_CARE_TEAM_ID];

  const singleCareTeam = useQuery(
    `${FHIR_CARE_TEAM}/${careTeamId}`,
    async () =>
      careTeamId ? FHIR.client(fhirBaseURL).request(`${FHIR_CARE_TEAM}/${careTeamId}`) : undefined,
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.ICareTeam) => res,
    }
  );

  const fhirGroups = useQuery(
    FHIR_GROUPS,
    async () => FHIR.client(fhirBaseURL).request(FHIR_GROUPS),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  const fhirPractitioners = useQuery(
    FHIR_PRACTITIONERS,
    async () => FHIR.client(fhirBaseURL).request(FHIR_PRACTITIONERS),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  if (singleCareTeam.isLoading || fhirGroups.isLoading || fhirPractitioners.isLoading) {
    return <Spin size="large" />;
  }

  const careTeamFormProps = {
    fhirBaseURL,
    initialValues: {
      uuid: (singleCareTeam.data?.identifier as Dictionary[])[0].value as any,
      id: singleCareTeam.data ? singleCareTeam.data.id : '',
      name: singleCareTeam.data ? singleCareTeam.data.name : '',
      status: singleCareTeam.data ? singleCareTeam.data.status : '',
      practitionersId: singleCareTeam.data
        ? singleCareTeam.data.participant?.map((p: any) => p.member.reference.split('/')[1]) ?? []
        : [],
      groupsId: singleCareTeam.data
        ? singleCareTeam.data.subject?.reference?.split('/')[1] ?? ''
        : '',
    },
    practitioners: fhirPractitioners.data?.entry?.map((e: any) => {
      return {
        id: e.resource.id,
        name: getPatientName(e.resource),
      };
    }),
    groups: fhirGroups.data?.entry?.map((e: any) => ({
      id: e.resource?.id,
      name: e.resource?.name as string,
    })),
  };

  return (
    <Row>
      <Col span={24}>
        <CareTeamForm {...careTeamFormProps} />
      </Col>
    </Row>
  );
};

CreateEditCareTeam.defaultProps = defaultEditCareTeamsProps;

export { CreateEditCareTeam };
