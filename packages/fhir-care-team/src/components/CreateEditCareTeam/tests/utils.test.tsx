import { getPatientName } from '../utils';

test('getPatientName works for undefined input', () => {
  expect(getPatientName()).toEqual('');
});
