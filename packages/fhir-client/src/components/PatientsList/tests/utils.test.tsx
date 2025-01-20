import {
  getPatientName,
  getPatientStatus,
  getObservationLabel,
  buildObservationValueString,
} from '../utils';

test('get patient name for undefined', () => {
  expect(getPatientName()).toEqual('');
});

test('getPatientStatus works correctly', () => {
  const t = (x: string) => x;
  expect(getPatientStatus(true, true, t)).toEqual({ title: t('Deceased'), color: 'red' });
  expect(getPatientStatus(true, false, t)).toEqual({ title: t('Active'), color: 'green' });
  expect(getPatientStatus(false, true, t)).toEqual({ title: t('Deceased'), color: 'red' });
  expect(getPatientStatus(false, true, t)).toEqual({ title: t('Deceased'), color: 'red' });
  expect(getPatientStatus(false, false, t)).toEqual({ title: t('Inactive'), color: 'gray' });
});

describe('getObservationLabel', () => {
  test('returns display property if available', () => {
    const resource = {
      code: { coding: [{ display: 'Test Display' }] },
    };
    expect(getObservationLabel(resource)).toBe('Test Display');
  });

  test('returns text property if display is missing', () => {
    const resource = {
      code: { text: 'Test Text' },
    };
    expect(getObservationLabel(resource)).toBe('Test Text');
  });

  test('returns valueQuantity.code if display and text are missing', () => {
    const resource = {
      valueQuantity: { code: 'Test Code' },
    };
    expect(getObservationLabel(resource)).toBe('Test Code');
  });

  test('returns undefined if all properties are missing', () => {
    const resource = {};
    expect(getObservationLabel(resource)).toBeUndefined();
  });
});

describe('buildObservationValueString', () => {
  test('builds value string for array component with labels and values', () => {
    const resource = {
      component: [
        {
          code: { coding: [{ display: 'Blood Pressure Systolic' }] },
          valueQuantity: { value: 120, unit: 'mmHg' },
        },
        {
          code: { coding: [{ display: 'Blood Pressure Diastolic' }] },
          valueQuantity: { value: 80, unit: 'mmHg' },
        },
      ],
    };
    expect(buildObservationValueString(resource)).toBe(' Systolic: 120mmHg,  Diastolic: 80mmHg');
  });

  test('handles non-array component gracefully', () => {
    const resource = {
      valueQuantity: { value: 98.6, unit: '°F' },
    };
    expect(buildObservationValueString(resource)).toBe('98.6 °F');
  });

  test('returns N/A if valueQuantity is missing in non-array component', () => {
    const resource = {};
    expect(buildObservationValueString(resource)).toBe(' ');
  });

  test('handles missing unit or value gracefully in array component', () => {
    const resource = {
      component: [
        {
          code: { coding: [{ display: 'Blood Pressure Systolic' }] },
          valueQuantity: { value: 120 },
        },
        {
          code: { coding: [{ display: 'Blood Pressure Diastolic' }] },
          valueQuantity: { unit: 'mmHg' },
        },
      ],
    };
    expect(buildObservationValueString(resource)).toBe(' Systolic: 120,  Diastolic: mmHg');
  });

  test('handles empty array component gracefully', () => {
    const resource = {
      component: [],
    };
    expect(buildObservationValueString(resource)).toBe('');
  });
});
