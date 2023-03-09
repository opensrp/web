import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button } from 'antd';
import { parseGroup, ViewDetailsProps, ViewDetailsWrapper } from '../GroupDetail';
import { PlusOutlined } from '@ant-design/icons';
import { groupResourceType } from '../../../constants';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import {
  SearchForm,
  BrokenPage,
  TableLayout,
  Column,
  useTabularViewWithLocalSearch,
} from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useTranslation } from '../../../mls';
import { TFunction } from '@opensrp/i18n';

export type TableData = ReturnType<typeof parseGroup>;

export type BaseListViewProps = Pick<ViewDetailsProps, 'keyValueMapperRenderProp'> & {
  fhirBaseURL: string;
  getColumns: (t: TFunction) => Column<TableData>[];
  extraQueryFilters?: Record<string, string>;
  createButtonLabel: string;
  createButtonUrl?: string;
  pageTitle: string;
  viewDetailsListUrl: string;
};

interface RouteParams {
  id?: string;
}

/**
 * how should objects be matched against the search string
 *
 * @param obj - resource payload
 * @param search - the search string
 */
//  TODO - Repeated.
export const matchesGroup = (obj: IGroup, search: string) => {
  const name = obj.name;
  if (name === undefined) {
    return false;
  }
  return name.toLowerCase().includes(search.toLowerCase());
};

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const BaseListView = (props: BaseListViewProps) => {
  const {
    fhirBaseURL,
    extraQueryFilters,
    getColumns,
    createButtonLabel,
    createButtonUrl,
    keyValueMapperRenderProp,
    pageTitle,
    viewDetailsListUrl,
  } = props;

  const { id: resourceId } = useParams<RouteParams>();
  const { t } = useTranslation();

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useTabularViewWithLocalSearch(
    fhirBaseURL,
    groupResourceType,
    matchesGroup,
    extraQueryFilters
  );

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data ?? []).map((org: IGroup, index: number) => {
    return {
      ...parseGroup(org),
      key: `${index}`,
    };
  });

  const columns = getColumns(t);

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} />
            {createButtonUrl && (
              <Link to={createButtonUrl}>
                <Button type="primary">
                  <PlusOutlined />
                  {createButtonLabel}
                </Button>
              </Link>
            )}
          </div>
          <TableLayout {...tableProps} />
        </Col>
        <ViewDetailsWrapper
          resourceId={resourceId}
          fhirBaseURL={fhirBaseURL}
          keyValueMapperRenderProp={keyValueMapperRenderProp}
          listUrl={viewDetailsListUrl}
        />
      </Row>
    </div>
  );
};
