import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import reducerRegistry from '@onaio/redux-reducer-registry';
import reducer, { reducerName } from '../../ducks/location-units';
import Form from './Form';
import { useParams } from 'react-router';

reducerRegistry.register(reducerName, reducer);

export interface Props {
  opensrpBaseURL: string;
}

/** default component props */
export const defaultProps = {
  opensrpBaseURL: '',
};

export const LocationUnitGroupAddEdit: React.FC<Props> = (props: Props) => {
  const params: { id: string } = useParams();
  const { opensrpBaseURL } = props;
  return (
    <Row className="layout-content">
      <Helmet>
        <title>{params.id ? 'Edit' : 'Add'} Location Unit Group</title>
      </Helmet>

      <h5 className="mb-4">{params.id ? 'Edit' : 'Add'} Location Unit Group</h5>

      <Col className="bg-white p-4" span={24}>
        <Form opensrpBaseURL={opensrpBaseURL} id={params.id} />
      </Col>
    </Row>
  );
};

LocationUnitGroupAddEdit.defaultProps = defaultProps;
export default LocationUnitGroupAddEdit;
