import { getStatusColor } from '../statusTag';

test('getStatusColor works correctly', () => {
  expect(getStatusColor('completed')).toBe('success');
  expect(getStatusColor('active')).toBe('processing');
  expect(getStatusColor('failed')).toBe('error');
  expect(getStatusColor('paused')).toBe('warning');
  expect(getStatusColor('waiting')).toBe('default');
});
