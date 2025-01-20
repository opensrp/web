import { Dictionary } from '@onaio/utils';
import get from 'lodash/get';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { parseFhirHumanName } from '@opensrp/react-utils';
import { TFunction } from '@opensrp/i18n';

export enum PatientStatus {
  ACTIVE = 'Active',
  InACTIVE = 'Inactive',
  DECEASED = 'Deceased',
}

/**
 * util to extract patient name
 *
 * @param patient - patient object
 * @returns - returns an array of name strings
 */
export function getPatientName(patient?: IPatient) {
  if (!patient) {
    return '';
  }
  const name = patient.name?.[0];
  return parseFhirHumanName(name);
}

/**
 * Function to get observation label
 *
 * @param {Object} obj - resource object
 * @returns {string} - returns label string
 */
export function getObservationLabel(obj: Dictionary): string {
  return (
    get(obj, 'code.coding.0.display') || get(obj, 'code.text') || get(obj, 'valueQuantity.code')
  );
}

/**
 * Function to get observation value quantity
 *
 * @param obj - resource object
 * @returns - returns value string
 */
export function buildObservationValueString(obj: Dictionary): string {
  let quantValue = '';
  if (obj.component && Array.isArray(obj.component)) {
    obj.component.forEach((c, i) => {
      quantValue =
        quantValue +
        `${getObservationLabel(c).replace('Blood Pressure', '')}: ${
          get(c, 'valueQuantity.value') || ''
        }${get(c, 'valueQuantity.unit') || ''}${i > 0 ? '' : ', '}`;
    });
  } else {
    quantValue =
      `${get(obj, 'valueQuantity.value') || ''} ${get(obj, 'valueQuantity.unit') || ''}` || 'N/A';
  }
  return quantValue;
}

/**
 * Function to get patient status based on active and deceased status
 *
 * @param isActive - Patient active status
 * @param isDeceased - Patient deceased status
 * @param t - translator function
 */
export const getPatientStatus = (isActive: boolean, isDeceased: boolean, t: TFunction) => {
  if (isDeceased) {
    return { title: t('Deceased'), color: 'red' };
  }
  if (isActive) {
    return { title: t('Active'), color: 'green' };
  }
  return { title: t('Inactive'), color: 'gray' };
};
