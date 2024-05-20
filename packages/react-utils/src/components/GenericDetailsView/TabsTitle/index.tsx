import React from 'react';
import { FHIRServiceClass } from '../../../helpers/dataLoaders';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { useQuery } from 'react-query';
import { Badge } from 'antd';
import './index.css';

export interface TabsTitleProps {
  title: string;
  fhirBaseURL: string;
  resourceType: string;
  resourceFilters: Record<string, string>;
}

export const TabsTitle = (props: TabsTitleProps) => {
  const { title, resourceType, fhirBaseURL, resourceFilters } = props;
  const summaryFilters = {
    _summary: 'count',
    ...resourceFilters,
  };
  const filterString = Object.values(summaryFilters).join(',');
  const { data, error } = useQuery({
    queryKey: [resourceType, filterString],
    queryFn: async () =>
      await new FHIRServiceClass<IBundle>(fhirBaseURL, resourceType).list(summaryFilters),
  });
  if (error || !data) {
    return <div>{title}</div>;
  }
  const count = data.total ?? 0;
  return (
    <div>
      {title} <Badge count={count} showZero />
    </div>
  );
};