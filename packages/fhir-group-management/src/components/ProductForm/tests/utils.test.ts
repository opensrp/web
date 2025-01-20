import { normalizeFileInputEvent, validateFileFactory } from '../utils';
import { UploadChangeParam, UploadFile } from 'antd';
import { TFunction } from 'i18next';

describe('normalizeFileInputEvent', () => {
  test('returns the input as-is if it is an array', () => {
    const inputArray: UploadFile[] = [{ uid: '1', name: 'testFile.txt', status: 'done' }];
    expect(normalizeFileInputEvent(inputArray)).toBe(inputArray);
  });

  test('returns fileList from the input event', () => {
    const event: UploadChangeParam<UploadFile> = {
      fileList: [{ uid: '1', name: 'testFile.txt', status: 'done' }],
      file: { uid: '1', name: 'testFile.txt', status: 'done' },
    };
    expect(normalizeFileInputEvent(event)).toBe(event.fileList);
  });
});

describe('validateFileFactory', () => {
  const tMock: TFunction = jest.fn((key) => key);

  const validateFile = validateFileFactory(tMock);

  test('resolves for files smaller than 5MB', async () => {
    const smallFile: UploadFile = {
      uid: '1',
      name: 'smallFile.txt',
      size: 3 * 1024 * 1024, // 3MB
      originFileObj: new File([], 'smallFile.txt', { size: 3 * 1024 * 1024 }),
    };

    await expect(validateFile(null, [smallFile])).resolves.toBeUndefined();
  });

  test('resolves for undefined or empty fileList', async () => {
    await expect(validateFile(null, undefined)).resolves.toBeUndefined();
    await expect(validateFile(null, [])).resolves.toBeUndefined();
  });

  test('does not throw when file size is undefined', async () => {
    const fileWithoutSize: UploadFile = {
      uid: '1',
      name: 'fileWithoutSize.txt',
      originFileObj: new File([], 'fileWithoutSize.txt'),
    };

    await expect(validateFile(null, [fileWithoutSize])).resolves.toBeUndefined();
  });
});
