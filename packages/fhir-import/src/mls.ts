import { useTranslation as useOrigTranslation } from '@opensrp/i18n';
import type { UseTranslationOptions } from '@opensrp/i18n';

export const namespace = 'fhir-import';

export const useTranslation = (ns?: string, options?: UseTranslationOptions) => {
  return useOrigTranslation(ns ? ns : namespace, options);
};
