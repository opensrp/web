import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { HealthcareService, Organization } from '../../types';
import Form, { FormField } from './Form';
import { useParams } from 'react-router';
import {
  FHIR_RESOURCES_PAGE_SIZE,
  HEALTHCARES_GET,
  HEALTH_CARE_SERVICE_RESOURCE_TYPE,
  ORGANIZATION_GET,
} from '../../constants';
import { sendErrorNotification } from '@opensrp/notifications';
import { Spin } from 'antd';
import lang from '../../lang';
import { useQuery } from 'react-query';
import { FHIRServiceClass } from '@opensrp/react-utils';

export interface Props {
  fhirBaseURL: string;
}

/** default component props */
export const defaultProps = {
  fhirBaseURL: '',
};

export const HealthCareAddEdit: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;
  const fhirParams = {
    _count: FHIR_RESOURCES_PAGE_SIZE,
    _getpagesoffset: 0,
  };

  const healthcareserviceAPI = new FHIRServiceClass<HealthcareService>(
    fhirBaseURL,
    HEALTH_CARE_SERVICE_RESOURCE_TYPE
  );
  const organizationAPI = new FHIRServiceClass<Organization>(
    fhirBaseURL,
    HEALTH_CARE_SERVICE_RESOURCE_TYPE
  );
  const params: { id?: string } = useParams();
  const [initialValue, setInitialValue] = useState<FormField>();

  const Healthcares = useQuery(
    [HEALTHCARES_GET, params.id],
    async () => healthcareserviceAPI.read(`${params.id}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
      select: (res: HealthcareService) => res,
      enabled: params.id !== undefined,
    }
  );

  const organizations = useQuery(ORGANIZATION_GET, async () => organizationAPI.list(fhirParams), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res) => res.entry.map((e) => e.resource),
  });

  if (params.id && Healthcares.data && !initialValue) {
    const healthcares = Healthcares.data;
    setInitialValue({ comment: '', extraDetails: '', ...healthcares });
  }

  if (!organizations.data || (params.id && !initialValue)) return <Spin size={'large'} />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{params.id ? lang.EDIT : lang.CREATE} Healthcare</title>
      </Helmet>

      <h5 className="mb-3 header-title">
        {initialValue?.name
          ? `${lang.EDIT_HEALTHCARE} | ${initialValue.name}`
          : lang.CREATE_HEALTHCARE}
      </h5>

      <div className="bg-white p-5">
        <Form
          fhirBaseURL={fhirBaseURL}
          initialValue={initialValue}
          organizations={organizations.data}
        />
      </div>
    </section>
  );
};

export default HealthCareAddEdit;