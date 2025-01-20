import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { useMls } from '../../../mls';
import React from 'react';
import { ResourceDetails } from '@opensrp/react-utils';
import { parseLocationDetails } from '../utils';
import { RbacCheck } from '@opensrp/rbac';
import { EditLink } from '../../EditLink';

export const GeometryRender = ({ geometry }: { geometry?: string }) => {
  let formattedGeo = geometry ?? '';
  try {
    formattedGeo = JSON.stringify(JSON.parse(formattedGeo), undefined, 2);
  } catch {
    // do nothing
  }
  return (
    <pre
      style={{
        maxHeight: '60px',
        maxWidth: '120px',
        overflow: 'auto',
        border: '1px solid #ddd',
        padding: '4px',
      }}
    >
      {formattedGeo}
    </pre>
  );
};

export const LocationDetails = ({ location }: { location: ILocation }) => {
  const { t } = useMls();
  const {
    id,
    name,
    status,
    physicalType,
    lastUpdated,
    geometry,
    longitude,
    latitude,
    version,
    alias,
    description,
    administrativeLevel,
  } = parseLocationDetails(location);

  const otherDetailsMap = {
    [t('Location Name')]: name,
    [t('Status')]: status,
    [t('alias')]: alias,
    [t('Latitude & Longitude')]: latitude && longitude ? `${latitude}, ${longitude}` : undefined,
    [t('Physical Type')]: physicalType.display,
    [t('Geometry')]: geometry ? <GeometryRender geometry={geometry} /> : undefined,
    [t('Administrative Level')]: administrativeLevel,
    [t('Description')]: description,
  };
  const dateCreatedKeyPairing = {
    [t('Date Last Updated')]: lastUpdated,
  };
  const headerLeftData = {
    ID: id,
    Version: version,
  };
  return (
    <ResourceDetails
      title={name}
      headerLeftData={headerLeftData}
      headerRightData={dateCreatedKeyPairing}
      headerActions={
        <RbacCheck permissions={['Location.update']}>
          <EditLink location={location} editLinkText={t('Edit details')} />
        </RbacCheck>
      }
      bodyData={otherDetailsMap}
    />
  );
};
