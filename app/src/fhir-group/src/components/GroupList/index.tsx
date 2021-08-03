/* eslint-disable @typescript-eslint/camelcase */
import React, { ChangeEvent, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GroupDetails from '../GroupDetail';
import { SearchOutlined } from '@ant-design/icons';
import { sendErrorNotification } from '@opensrp/notifications';
import { Groups, GroupDetail } from '../../types';
import { GROUP_GET, URL_ADD_GROUP } from '../../constants';
import Table, { TableData } from './Table';
import './index.css';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import lang from '../../lang';
import { useQuery } from 'react-query';
import FHIR from 'fhirclient';
import { FHIRResponse } from '../../fhirutils';
import { loadGroupDetails } from '../../utils';

interface Props {
  fhirBaseURL: string;
}

/** Function which shows the list of all group and there details
 *
 * @param {Object} props - GroupList component props
 * @returns {Function} returns healthcare display
 */
export const GroupList: React.FC<Props> = (props: Props) => {
  const { fhirBaseURL } = props;

  const serve = FHIR.client(fhirBaseURL);

  const [detail, setDetail] = useState<GroupDetail | 'loading' | null>(null);
  const [filterData, setfilterData] = useState<{ search?: string; data?: TableData[] }>({});

  const healthcare = useQuery(GROUP_GET, () => serve.request(GROUP_GET), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURRED),
    select: (res: FHIRResponse<Groups>) => res.entry.map((e) => e.resource),
  });

  const tableData: TableData[] = useMemo(() => {
    if (healthcare.data) {
      return healthcare.data.map((healthcare, i) => {
        return { ...healthcare, key: i.toString() } as TableData;
      });
    } else return [];
  }, [healthcare.data]);

  /**
   * Returns filted list of group
   *
   * @param {ChangeEvent<HTMLInputElement>} e event recieved onChange
   */
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const currentValue = e.target.value;
    const filteredData = tableData.filter((row) =>
      row.name.toLowerCase().includes(currentValue.toLowerCase())
    );
    setfilterData({ search: currentValue, data: filteredData });
  };

  if (!tableData.length) return <Spin size="large" />;

  return (
    <section className="layout-content">
      <Helmet>
        <title>{lang.GROUPS}</title>
      </Helmet>
      <h5 className="mb-3">{lang.GROUPS}</h5>
      <Row>
        <Col className="bg-white p-3" span={detail ? 19 : 24}>
          <div className="mb-3 d-flex justify-content-between">
            <h5>
              <Input
                placeholder={lang.SEARCH}
                size="large"
                defaultValue={filterData.search}
                prefix={<SearchOutlined />}
                onChange={onChange}
              />
            </h5>
            <div>
              <Link to={URL_ADD_GROUP}>
                <Button type="primary">
                  <PlusOutlined />
                  {lang.CREATE_GROUP}
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-white">
            <Table
              data={filterData.search && filterData.data?.length ? filterData.data : tableData}
              fhirBaseURL={fhirBaseURL}
              onViewDetails={(prams) => {
                setDetail('loading');
                loadGroupDetails(prams)
                  .then((healthcare) => setDetail(healthcare))
                  .catch(() => {
                    sendErrorNotification(lang.ERROR_OCCURRED);
                    setDetail(null);
                  });
              }}
            />
          </div>
        </Col>
        {detail ? (
          detail === 'loading' ? (
            <Spin size="large" style={{ flexGrow: 1, width: 'auto', height: 'auto' }} />
          ) : (
            <Col className="pl-3" span={5}>
              <GroupDetails onClose={() => setDetail(null)} {...detail} />
            </Col>
          )
        ) : (
          <></>
        )}
      </Row>
    </section>
  );
};

export default GroupList;
