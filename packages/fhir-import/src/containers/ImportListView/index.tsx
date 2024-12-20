import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button } from 'antd';
import { BodyLayout, OpenSRPService } from '@opensrp/react-utils';
import { CloudUploadOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { useHistory, Link } from 'react-router-dom';
import { BrokenPage, TableLayout } from '@opensrp/react-utils';
import {
  DATA_IMPORT_DETAIL_URL,
  DATA_IMPORT_CREATE_URL,
  dataImportRQueryKey,
  IMPORT_DOMAIN_URI,
} from '../../constants';
import { useTranslation } from '../../mls';
import { RbacCheck } from '@opensrp/rbac';
import { useQuery } from 'react-query';
import { JobStatus, WorkflowDescription, formatTimestamp } from '../../helpers/utils';
import { ImportStatusTag } from '../../components/statusTag';

// route params for care team pages
interface RouteParams {
  workflowId: string | undefined;
}

export type ImportListPropTypes = RouteComponentProps<RouteParams>;

/**
 * Renders a list view for all bulk upload jobs.
 */
export const DataImportList = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const { data, isFetching, isLoading, error } = useQuery(dataImportRQueryKey, () => {
    const service = new OpenSRPService('/$import', IMPORT_DOMAIN_URI);
    return service.list().then((res) => {
      return res;
    });
  });

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const columns = [
    {
      title: t('Workflow Id'),
      dataIndex: 'workflowId' as const,
    },
    {
      title: t('Resource upload'),
      dataIndex: 'workflowType' as const,
    },
    {
      title: t('File name'),
      dataIndex: 'filename' as const,
    },
    {
      title: t('status'),
      dataIndex: 'status' as const,
      render: (_: JobStatus) => {
        return <ImportStatusTag statusString={_} />;
      },
    },
    {
      title: t('Date created'),
      dataIndex: 'dateCreated' as const,
      defaultSortOrder: 'descend' as const,
      sortDirections: ['ascend' as const, 'descend' as const],
      sorter: (a: WorkflowDescription, b: WorkflowDescription) => {
        const diff = a.dateCreated - b.dateCreated;
        return diff === 0 ? 0 : diff > 0 ? 1 : -1;
      },
      render: (_: number) => formatTimestamp(_),
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: WorkflowDescription) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['DataImport.read']}>
            <>
              <Link
                to={`${DATA_IMPORT_DETAIL_URL}/${record.workflowId.toString()}`}
                className="m-0 p-1"
              >
                {t('View')}
              </Link>
            </>
          </RbacCheck>
        </span>
      ),
    },
  ];

  const tableProps = {
    datasource: data ?? [],
    columns,
    loading: isFetching || isLoading,
  };
  const pageTitle = t('Data imports');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <div />
            <RbacCheck permissions={['DataImport.create']}>
              <Link to={DATA_IMPORT_CREATE_URL}>
                <Button type="primary" onClick={() => history.push(DATA_IMPORT_CREATE_URL)}>
                  <CloudUploadOutlined />
                  {t('Bulk upload')}
                </Button>
              </Link>
            </RbacCheck>
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </BodyLayout>
  );
};
