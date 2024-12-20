import React from 'react';
import { Row, Col, Button, Radio, Space } from 'antd';
import {
  getQueryParams,
  SearchForm,
  TableLayout,
  BrokenPage,
  searchQuery,
  useSearchParams,
  viewDetailsQuery,
  useClientSideDataGridFilters,
} from '@opensrp/react-utils';
import { PlusOutlined } from '@ant-design/icons';
import { URL_USER_CREATE, KEYCLOAK_URL_USERS } from '@opensrp/user-management';
import { loadKeycloakResources } from './utils';
import { getTableColumns } from './tableColumns';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { BodyLayout } from '@opensrp/react-utils';
import { getExtraData } from '@onaio/session-reducer';
import { KeycloakUser } from '@opensrp/user-management';
import { useSelector } from 'react-redux';
import { Trans } from '@opensrp/i18n';
import { RbacCheck, useUserRole } from '@opensrp/rbac';
import { UserDetailsOverview } from '../ViewdetailsOverview';
import { useTranslation } from '../../../mls';

interface OrganizationListProps {
  fhirBaseURL: string;
  keycloakBaseURL: string;
}

const nameFilterKey = 'name';
const activeFilterKey = 'status';

/**
 * Renders users in a table
 *
 * @param props -  component props
 */
export const UserList = (props: OrganizationListProps) => {
  const { fhirBaseURL, keycloakBaseURL } = props;
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const extraData = useSelector(getExtraData);
  const { t } = useTranslation();
  const userRole = useUserRole();
  const { sParams } = useSearchParams();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;

  const { isLoading, data, error, isFetching } = useQuery([KEYCLOAK_URL_USERS], () =>
    loadKeycloakResources(keycloakBaseURL, KEYCLOAK_URL_USERS)
  );

  const { registerFilter, filterRegistry, deregisterFilter, filteredData } =
    useClientSideDataGridFilters<KeycloakUser>(data?.records ?? []);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const columns = getTableColumns(keycloakBaseURL, fhirBaseURL, extraData, t, userRole, history);

  const searchFormProps = {
    wrapperClassName: 'elongate-search-bar',
    defaultValue: getQueryParams(location)[searchQuery],
    onChangeHandler: function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
      const searchText = event.target.value;
      let nextUrl = match.url;
      const currentSParams = new URLSearchParams(location.search);

      if (searchText) {
        currentSParams.set(searchQuery, searchText);
        registerFilter(
          nameFilterKey,
          (el) => {
            const lowerSearchCase = searchText.toLowerCase();
            const firstSearch = !!(el.firstName ?? '').toLowerCase().includes(lowerSearchCase);
            const lastSearch = !!(el.lastName ?? '').toLowerCase().includes(lowerSearchCase);
            const userSearch = !!el.username.toLowerCase().includes(lowerSearchCase);
            return firstSearch || lastSearch || userSearch;
          },
          searchText
        );
      } else {
        currentSParams.delete(searchQuery);
        deregisterFilter(nameFilterKey);
      }

      nextUrl = ''.concat(nextUrl, '?').concat(currentSParams.toString());
      history.push(nextUrl);
    },
  };

  const tableProps = {
    datasource: filteredData,
    columns,
    loading: isFetching || isLoading,
  };

  const title = t('User Management');
  const headerProps = {
    pageHeaderProps: {
      title,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Row className="list-view">
        <Col className="main-content">
          <div>
            <div className="main-content__header">
              <SearchForm data-testid="search-form" {...searchFormProps} />
              <RbacCheck permissions={['iam_user.create', 'Practitioner.create']}>
                <Button type="primary" onClick={() => history.push(URL_USER_CREATE)}>
                  <PlusOutlined />
                  {t('Add User')}
                </Button>
              </RbacCheck>
            </div>
            <div className="pb-3">
              <Trans t={t} i18nKey="keycloakUserStatusFilter">
                <Space>
                  Status:
                  <Radio.Group
                    size="small"
                    value={filterRegistry[activeFilterKey]?.value}
                    buttonStyle="solid"
                    onChange={(event) => {
                      const val = event.target.value;
                      if (val !== undefined) {
                        registerFilter(
                          activeFilterKey,
                          (el) => {
                            return el.enabled === val;
                          },
                          val
                        );
                      } else {
                        registerFilter(activeFilterKey, undefined);
                      }
                    }}
                  >
                    <Radio.Button value={true}>Enabled</Radio.Button>
                    <Radio.Button value={false}>Disabled</Radio.Button>
                    <Radio.Button value={undefined}>Show all</Radio.Button>
                  </Radio.Group>
                </Space>
              </Trans>
            </div>
          </div>
          <div className="dataGridWithOverview">
            <div className="dataGridWithOverview-table">
              <TableLayout {...tableProps} />
            </div>
            {resourceId ? (
              <div className="view-details-content dataGridWithOverview-overview">
                <UserDetailsOverview keycloakBaseURL={keycloakBaseURL} resourceId={resourceId} />
              </div>
            ) : null}
          </div>
        </Col>
      </Row>
    </BodyLayout>
  );
};
