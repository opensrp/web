import { Rule } from 'antd/es/form';
import { TFunction } from '@opensrp/i18n';
import {
  id,
  identifier,
  active,
  unitOfMeasure,
  name,
  type,
  materialNumber,
  isAttractiveItem,
  availability,
  condition,
  appropriateUsage,
  accountabilityPeriod,
  productImage,
} from '../../constants';
import { capitalize, values } from 'lodash';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { R4GroupTypeCodes } from '@opensrp/fhir-helpers';

export enum UnitOfMeasure {
  Pieces = 'Pieces',
  Tablets = 'Tablets',
  Ampoules = 'Ampoules',
  Strips = 'Strips',
  Cycles = 'Cycles',
  Bottles = 'Bottles',
  TestKits = 'Test kits',
  Sachets = 'Sachets',
  Straps = 'Straps',
}

/**
 * extract file from an input event
 *
 * @param e - event after a file upload
 */
export const normalizeFileInputEvent = (e: UploadChangeParam<UploadFile>) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e.fileList;
};

export const validateFileFactory =
  (t: TFunction) => (_: unknown, fileList: UploadFile[] | undefined) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const MAX_IMAGE_SIZE_MB = 5;
      if (file && file.size / 1024 / 1024 > MAX_IMAGE_SIZE_MB) {
        return Promise.reject(new Error(t('File must be smaller than 5MB!')));
      }
    }

    return Promise.resolve();
  };

// TODO - Do we really need this.
/**
 * factory to create default validation rules
 *
 * @param t - translator function
 */
export function defaultValidationRulesFactory(t: TFunction) {
  return {
    [id]: [{ type: 'string' }] as Rule[],
    [identifier]: [{ type: 'string' }] as Rule[],
    [name]: [{ type: 'string', message: t('Must be a valid string') }] as Rule[],
    [active]: [{ type: 'boolean' }] as Rule[],
    [type]: [{ type: 'enum', enum: Object.values(R4GroupTypeCodes) }] as Rule[],
    [unitOfMeasure]: [{ type: 'enum', enum: Object.values(UnitOfMeasure) }] as Rule[],
    [materialNumber]: [{ type: 'string' }] as Rule[],
    [isAttractiveItem]: [{ type: 'boolean' }] as Rule[],
    [availability]: [{ type: 'string' }] as Rule[],
    [condition]: [{ type: 'string' }] as Rule[],
    [appropriateUsage]: [{ type: 'string' }] as Rule[],
    [accountabilityPeriod]: [{ type: 'number' }] as Rule[],
    [productImage]: [
      { type: 'array', max: 1 },
      {
        validator: validateFileFactory(t),
      },
    ] as Rule[],
  };
}

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * get select options for group types
 *
 */
export const getGroupTypeOptions = () => {
  return values(R4GroupTypeCodes).map((group) => {
    return {
      value: group,
      label: capitalize(group),
    };
  });
};

/**
 * get select options for group units of measure
 *
 */
export const getUnitOfMeasureOptions = () => {
  return values(UnitOfMeasure).map((measure) => {
    return {
      value: measure,
      label: capitalize(measure),
    };
  });
};

/**
 * filter select options
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const groupSelectfilterFunction = (inputValue: string, option?: SelectOption) => {
  return !!option?.label.toLowerCase().includes(inputValue.toLowerCase());
};
