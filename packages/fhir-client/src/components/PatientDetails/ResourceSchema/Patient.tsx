import React from 'react';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { sorterFn } from '../../../helpers/utils';
import { getPatientName, getPatientStatus } from '../../PatientsList/utils';
import { Button, Tag, Typography } from 'antd';
import { Column, ResourceDetailsProps, dateToLocaleString } from '@opensrp/react-utils';
import type { TFunction } from '@opensrp/i18n';
import { get } from 'lodash';

const { Text } = Typography;

const id = 'id' as const;
const name = 'name' as const;
const dob = 'dob' as const;
const gender = 'gender' as const;
const deceased = 'deceased' as const;
const active = 'active' as const;

export const parsePatient = (patient: IPatient) => {
  const { birthDate, deceasedBoolean } = patient;
  return {
    [id]: patient.id,
    [name]: getPatientName(patient) ?? id,
    [dob]: birthDate,
    [gender]: patient.gender,
    [deceased]: deceasedBoolean,
    [active]: patient.active,
  };
};

export type PatientTableData = ReturnType<typeof parsePatient>;
type ShowPatientOverview = (id: string) => void;

const dobSorterFn = sorterFn(dob, true);

export const columns = (t: TFunction, showPatientOverview: ShowPatientOverview) =>
  [
    {
      title: t('Name'),
      dataIndex: name,
      key: name,
      render: (name: string, record: PatientTableData) => {
        return (
          <>
            <span>
              {name} {record.deceased ? <Tag color="red">Deceased</Tag> : null}
            </span>
          </>
        );
      },
    },
    {
      title: t('Date Of Birth'),
      dataIndex: dob,
      key: dob,
      sorter: dobSorterFn,
      render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
    },
    {
      title: t('Status'),
      dataIndex: active,
      key: active,
      render: (value: boolean) => <Text>{value === true ? t('Active') : t('Inactive')}</Text>,
    },
    {
      title: t('Gender'),
      dataIndex: gender,
      key: gender,
    },
    {
      title: t('Actions'),
      width: '20%',
      // eslint-disable-next-line react/display-name
      render: (record: PatientTableData) => (
        <span className="d-flex justify-content-start align-items-center">
          <Button
            data-testid={record.id}
            onClick={() => showPatientOverview(record.id as string)}
            type="link"
            className="m-0 p-1"
          >
            {t('View')}
          </Button>
        </span>
      ),
    },
  ] as Column<PatientTableData>;

/**
 * maps the column field keys to their corresponding Fhir sortable keys for this resource.
 */
export const sortMap = {
  [id]: 'identifier',
  [name]: 'name',
  [dob]: 'birthdate',
};

/**
 * Columns for this resource(Patients) but where sorting happens on the server side as opposed
 * to locally on the ui.
 *
 * @param t - the translator function
 * @param showPatientOverview - show the patient overview
 */
export const serverSideSortedColumns = (t: TFunction, showPatientOverview: ShowPatientOverview) => {
  return columns(t, showPatientOverview).map((column: ReturnType<typeof columns>[0]) => {
    const newColumn = { ...column };
    if (typeof column.sorter === 'function') {
      newColumn.sorter = true;
    }
    return newColumn;
  });
};

/**
 * Extract resource details props from resource
 *
 * @param resource - Patient resource
 * @param t - translation function
 */
export function patientDetailsProps(
  resource: IPatient | undefined,
  t: TFunction
): ResourceDetailsProps {
  if (!resource) {
    return {} as ResourceDetailsProps;
  }
  const { meta, gender, birthDate, id, active, deceasedBoolean } = resource;
  const patientName = getPatientName(resource);
  const splitName = patientName ? patientName.split(' ') : [];
  const headerRightData = {
    [t('Date created')]: dateToLocaleString(meta?.lastUpdated),
  };
  const headerLeftData = {
    [t('ID')]: id,
    [t('Gender')]: gender,
  };
  const bodyData = {
    [t('First name')]: splitName[0],
    [t('Last name')]: splitName[1],
    [t('UUID')]: get(resource, 'identifier.0.value'),
    [t('Date of birth')]: dateToLocaleString(birthDate, true),
    [t('Phone')]: get(resource, 'telecom.0.value'),
    [t('MRN')]: 'Unknown',
    [t('Address')]: get(resource, 'address.0.line.0') || 'N/A',
    [t('Country')]: get(resource, 'address.0.country'),
  };
  const patientStatus = getPatientStatus(active as boolean, deceasedBoolean as boolean, t);
  return {
    title: patientName,
    headerRightData,
    headerLeftData,
    bodyData,
    status: {
      title: patientStatus.title,
      color: patientStatus.color,
    },
  };
}
