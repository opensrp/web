/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Table, Spin, Divider, Dropdown, Menu, PageHeader } from 'antd';
import { Link } from 'react-router-dom';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { sendErrorNotification } from '@opensrp/notifications';
import { createChangeHandler, getQueryParams, SearchForm } from '@opensrp/react-utils';
import { KeycloakService } from '@opensrp/keycloak-service';
import {
  reducerName as keycloakUserGroupsReducerName,
  reducer as keycloakUserGroupsReducer,
} from '../../ducks/userGroups';
import {
  ACTIONS,
  ADD_USER_GROUP,
  ERROR_OCCURED,
  NAME,
  USER_GROUPS_PAGE_HEADER,
  VIEW_DETAILS,
} from '../../lang';
import {
  KEYCLOAK_URL_USER_GROUPS,
  ROUTE_PARAM_USER_GROUP_ID,
  SEARCH_QUERY_PARAM,
  URL_USER_GROUPS,
  URL_USER_GROUP_CREATE,
  URL_USER_GROUP_EDIT,
} from '../../constants';
import {
  fetchKeycloakUserGroups,
  KeycloakUserGroup,
  makeKeycloakUserGroupsSelector,
} from '../../ducks/userGroups';
import { ViewDetails } from '../UserGroupDetailView';

/** Register reducer */
reducerRegistry.register(keycloakUserGroupsReducerName, keycloakUserGroupsReducer);

// Define selector instance
const userGroupsSelector = makeKeycloakUserGroupsSelector();

// route params for user group pages
interface RouteParams {
  userGroupId: string | undefined;
}

export interface UserGroupMembers {
  createdTimestamp: number;
  disableableCredentialTypes?: string[];
  email?: string;
  emailVerified: boolean;
  enabled: boolean;
  firstName: string;
  id: string;
  lastName: string;
  notBefore: number;
  requiredActions: string[];
  totp: boolean;
  username: string;
}

interface TableData {
  key: number | string;
  id: string | undefined;
  name: string;
}

interface Props {
  keycloakBaseURL: string;
}

/** default component props */
const defaultProps = {
  keycloakBaseURL: '',
};

/** Function to fetch group members from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 * @param {Function} callback - callback function to set group members from api to state
 */
export const loadGroupMembers = async (
  groupId: string,
  baseURL: string,
  callback: (members: UserGroupMembers[]) => void
) => {
  const serve = new KeycloakService(`${KEYCLOAK_URL_USER_GROUPS}/${groupId}/members`, baseURL);
  return await serve
    .list()
    .then((response: UserGroupMembers[]) => {
      callback(response);
    })
    .catch((e: Error) => sendErrorNotification(`${e}`))
    .finally(() => <Redirect to={`${URL_USER_GROUPS}/${groupId}`} />);
};

/** Function to fetch group members from keycloak
 *
 * @param {string} groupId - user group id
 * @param {string} baseURL - keycloak base url
 * @param {Function} callback - callback function to set group members from api to state
 */
export const loadGroupDetails = async (
  groupId: string,
  baseURL: string,
  callback: (userGroups: KeycloakUserGroup) => void
) => {
  const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, baseURL);
  return await serve
    .read(groupId)
    .then((response: KeycloakUserGroup) => {
      callback(response);
    })
    .catch((e: Error) => sendErrorNotification(`${e}`));
};

export type UserGroupListTypes = Props & RouteComponentProps<RouteParams>;

/** Component which shows the list of all groups and their details
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns User Groups list display
 */
export const UserGroupsList: React.FC<UserGroupListTypes> = (props: UserGroupListTypes) => {
  const dispatch = useDispatch();
  const searchQuery = getQueryParams(props.location)[SEARCH_QUERY_PARAM] as string;
  const getUserGroupsList = useSelector((state) =>
    userGroupsSelector(state, { searchText: searchQuery })
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userGroupMembers, setUserGroupMembers] = useState<UserGroupMembers[] | null>(null);
  const [singleUserGroup, setSingleUserGroup] = useState<KeycloakUserGroup | null>(null);
  const history = useHistory();
  const { keycloakBaseURL } = props;
  const groupId = props.match.params[ROUTE_PARAM_USER_GROUP_ID] ?? '';

  useEffect(() => {
    if (isLoading) {
      const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
      serve
        .list()
        .then((response: KeycloakUserGroup[]) => {
          dispatch(fetchKeycloakUserGroups(response));
        })
        .catch(() => sendErrorNotification(ERROR_OCCURED))
        .finally(() => setIsLoading(false));
    }
  });

  useEffect(() => {
    if (groupId) {
      const membersPromise = loadGroupMembers(groupId, keycloakBaseURL, setUserGroupMembers);
      const userGroupPromise = loadGroupDetails(groupId, keycloakBaseURL, setSingleUserGroup);
      Promise.all([membersPromise, userGroupPromise])
        .catch((e) => sendErrorNotification(`${e}`))
        .finally(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  if (isLoading) return <Spin size="large" />;

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const tableData: TableData[] = getUserGroupsList.map(
    (userGroup: KeycloakUserGroup, index: number) => {
      return {
        key: `${index}`,
        id: userGroup.id,
        name: userGroup.name,
      };
    }
  );

  const columns = [
    {
      title: NAME,
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: ACTIONS,
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (record: KeycloakUserGroup) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={`${URL_USER_GROUP_EDIT}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item
                  className="viewdetails"
                  onClick={() => {
                    history.push(`${URL_USER_GROUPS}/${record.id}`);
                  }}
                >
                  {VIEW_DETAILS}
                </Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  return (
    <div className="content-section user-group">
      <Helmet>
        <title>{USER_GROUPS_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={USER_GROUPS_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className={'main-content'}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={URL_USER_GROUP_CREATE}>
              <Button type="primary">
                <PlusOutlined />
                {ADD_USER_GROUP}
              </Button>
            </Link>
          </div>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultPageSize: 5,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
        <ViewDetails
          userGroupMembers={userGroupMembers}
          singleUserGroupDetails={singleUserGroup}
          groupId={groupId}
        />
      </Row>
    </div>
  );
};

UserGroupsList.defaultProps = defaultProps;

export default UserGroupsList;
