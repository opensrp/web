import React from 'react';
import { Helmet } from 'react-helmet';
import { ImporterFormInstructions } from './formInstructions';
import { BodyLayout } from '@opensrp/react-utils';
import { Row, Col } from 'antd';
import { DataImportForm } from './form';
import { useTranslation } from '../../mls';

export const StartDataImport = () => {
  const { t } = useTranslation();
  const pageTitle = t('Data imports');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };
  return (
    <>
      <BodyLayout headerProps={headerProps}>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <Row className="list-view">
          <Col className="main-content">
            <ImporterFormInstructions />
            <DataImportForm />
          </Col>
        </Row>
      </BodyLayout>
    </>
  );
};
