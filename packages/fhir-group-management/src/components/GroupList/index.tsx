import React from 'react';
import { Space, Button, Divider, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { parseGroup } from '../BaseComponents/GroupDetail';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../mls';
import {
  BaseListView,
  BaseListViewProps,
  DefaultTableData,
} from '../BaseComponents/BaseGroupsListView';
import { TFunction } from '@opensrp/i18n';
import { SingleKeyNestedValue, useSearchParams, viewDetailsQuery } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { RbacCheck } from '@opensrp/rbac';

interface GroupListProps {
  fhirBaseURL: string;
}

const keyValueDetailRender = (obj: IGroup, t: TFunction) => {
  const { name, active, lastUpdated, id, quantity, members } = parseGroup(obj);
  const keyValues = {
    [t('Id')]: id,
    [t('Name')]: name,
    [t('Active')]: active ? t('Active') : t('Inactive'),
    [t('Last Updated')]: t('{{val, datetime}}', { val: new Date(lastUpdated) }),
    [t('No. of Members')]: quantity,
    [t('Members')]: members?.map((member) => member.entity.display).join(', '),
  };

  return (
    <Space direction="vertical">
      {Object.entries(keyValues).map(([key, value]) => {
        const props = {
          [key]: value,
        };
        return value ? (
          <div key={key} data-testid="key-value">
            <SingleKeyNestedValue data={props} />
          </div>
        ) : null;
      })}
    </Space>
  );
};

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const GroupList = (props: GroupListProps) => {
  const { fhirBaseURL } = props;

  const { t } = useTranslation();
  const { addParam } = useSearchParams();

  const getItems = (record: DefaultTableData): MenuProps['items'] => [
    {
      key: '1',
      label: (
        <Button
          type="link"
          data-testid="view-details"
          onClick={() => {
            addParam(viewDetailsQuery, record.id);
          }}
        >
          {t('View Details')}
        </Button>
      ),
    },
  ];

  const getColumns = (t: TFunction) => [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      key: 'name' as const,
    },
    {
      title: t('Active'),
      dataIndex: 'active' as const,
      key: 'active' as const,
      render: (value: boolean) => <div>{value ? 'Yes' : 'No'}</div>,
    },
    {
      title: t('Last Updated'),
      dataIndex: 'lastUpdated' as const,
      key: 'lastUpdated' as const,
      render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
    },
    {
      title: t('Actions'),
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: DefaultTableData) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['Group.update']}>
            <>
              <Link to={`#`} className="m-0 p-1" onClick={(e) => e.preventDefault()}>
                {t('Edit')}
              </Link>
              <Divider type="vertical" />
            </>
          </RbacCheck>
          <Dropdown
            menu={{ items: getItems(record) }}
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const baseListViewProps: BaseListViewProps = {
    getColumns: getColumns,
    keyValueMapperRenderProp: keyValueDetailRender,
    createButtonLabel: t('Add Group'),
    fhirBaseURL,
    pageTitle: t('Groups List'),
  };

  return <BaseListView {...baseListViewProps} />;
};
