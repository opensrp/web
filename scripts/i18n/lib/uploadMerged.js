import path from 'path';
import fs from 'fs';
import { ensureFilePath, getLocaleFolderPaths, REPO_ROOT_PATH } from './utils.js';

function processNamespace(namespace, unifiedJson, locale) {
  const baseLocale = 'en';
  const enReferenceResourceFile = `${namespace}/${baseLocale}.json`;
  const destReferenceResourceFile = `${namespace}/${locale}.json`;
  const referenceDict = JSON.parse(fs.readFileSync(enReferenceResourceFile, 'utf-8'));
  ensureFilePath(destReferenceResourceFile);
  const updatedStringMap = {};
  for (const key in referenceDict) {
    let updateValue = unifiedJson[key] ?? key;
    updatedStringMap[key] = updateValue;
  }
  fs.writeFileSync(destReferenceResourceFile, JSON.stringify(updatedStringMap, undefined, 2));
}

export async function uploadTranslations(inFile, projectCode = 'core', locale = 'en') {
  const unifiedJson = JSON.parse(fs.readFileSync(inFile, 'utf-8'));
  const resourceFolders = await getLocaleFolderPaths(projectCode);
  for (const namespace of resourceFolders) {
    const qualifiedNamespacePath = path.resolve(REPO_ROOT_PATH, namespace);
    processNamespace(qualifiedNamespacePath, unifiedJson, locale);
  }
}
