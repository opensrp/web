import { fileURLToPath } from 'url';
import path from 'path';
import glob from 'glob';
import { promisify } from 'util';
import * as fs from 'fs';

// Get __filename and __dirname equivalents
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const REPO_ROOT_PATH = path.resolve(__dirname, '../../../');

export const promisedGlob = promisify(glob);

/**
 * uses glob to get all the generated translation files for each package
 * as they reside in the package/i18n package
 * @param {string} projectCode informs on the namespace for which the translation files lie.
 * @param {string} locale informs which local files to pick under the project code namespace
 * @Returns {string[]} - matched paths
 */
export const getLocaleFilePaths = async (projectCode, locale) => {
  const workspacesGlob = `packages/i18n/locales/${projectCode}/*/${locale}.json`;
  return promisedGlob(workspacesGlob, { cwd: REPO_ROOT_PATH }).catch(() => {
    return [];
  });
};

/**
 * uses glob to get all the generated translation files for each package
 * as they reside in the package/i18n package
 * @param {string} projectCode informs on the namespace for which the translation files lie.
 * @param {string} locale informs which local files to pick under the project code namespace
 * @Returns {string[]} - matched paths
 */
export const getLocaleFolderPaths = async (projectCode) => {
  const workspacesGlob = `packages/i18n/locales/${projectCode}/*/`;
  return promisedGlob(workspacesGlob, { cwd: REPO_ROOT_PATH }).catch(() => {
    return [];
  });
};

/**
 * Ensures the directory for the given file path exists. If not, creates it synchronously.
 * @param {string} filePath - The full file path to ensure.
 */
export function ensureFilePath(filePath) {
  const dirPath = path.dirname(filePath); // Extract the directory path
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error ensuring file path: ${error.message}`);
    throw error; // Rethrow the error if mkdirSync fails
  }
}
