import { v4 } from 'uuid';
import {
  FHIRServiceClass,
  getObjLike,
  getResourcesFromBundle,
  IdentifierUseCodes,
  parseFhirHumanName,
  SelectOption,
  TransformOptions,
} from '@opensrp/react-utils';
import { sendSuccessNotification } from '@opensrp/notifications';
import {
  FHIR_CARE_TEAM,
  id,
  organizationParticipants,
  organizationResourceType,
  practitionerParticipants,
  practitionerResourceType,
  uuid,
  name,
  status,
  managingOrganizations,
} from '../../constants';
import { IfhirR4 } from '@smile-cdr/fhirts';
import type { TFunction } from '@opensrp/i18n';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { get } from 'lodash';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { CareTeamParticipant } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/careTeamParticipant';

/**
 * computes participants that should be carried over when generating the payload
 *
 * @param values - current form values
 * @param initialValues - initial form values
 */
const getCarriedOverParticipants = (values: FormFields, initialValues: FormFields) => {
  const { participant } = initialValues.initialCareTeam ?? {};
  const participantByKey = (participant ?? []).reduce((ac, val) => {
    const reference = val.member?.reference as string;
    return { ...ac, [reference]: val };
  }, {}) as Record<string, CareTeamParticipant>;
  const currentManagingOrgValuesyId = values[managingOrganizations].reduce((ac, val) => {
    return {
      ...ac,
      [val]: val,
    };
  }, {});
  const currentpractitionersById = values[practitionerParticipants].reduce((ac, val) => {
    return {
      ...ac,
      [val]: val,
    };
  }, {});
  const cleanParticipants = (refs: string[], lookup: Record<string, string>) => {
    refs.forEach((ref) => {
      if (!lookup[ref]) {
        delete participantByKey[ref];
      }
    });
  };
  cleanParticipants(initialValues.practitionerParticipants, currentpractitionersById);
  cleanParticipants(initialValues.managingOrganizations, currentManagingOrgValuesyId);
  return participantByKey;
};

export const submitForm = async (
  values: FormFields,
  initialValues: FormFields,
  fhirBaseURL: string,
  selectedOrganizations: SelectOption<IOrganization>[],
  selectedPractitioners: SelectOption<IPractitioner>[],
  t: TFunction
): Promise<void> => {
  const { initialCareTeam, id, uuid } = initialValues;
  const { meta, text, participant, ...nonMetaFields } = initialCareTeam ?? {};

  const participatingOrgsPayload = selectedOrganizations.map((orgOption) => {
    const { label, value } = orgOption;
    return {
      role: [
        {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '394730007',
              display: 'Healthcare related organization',
            },
          ],
        },
      ],
      member: {
        reference: value as string,
        display: label,
      },
    };
  });

  const practitionerParticipants = selectedPractitioners.map((option) => {
    const { label, value } = option;
    return {
      member: {
        reference: value as string,
        display: label,
      },
    };
  });

  const carriedOverParticipantsById = getCarriedOverParticipants(values, initialValues);
  const carriedOverParticipants = Object.values(carriedOverParticipantsById);
  const managingOrgsReferences = participatingOrgsPayload.map((payload) => payload.member);
  const allParticipants = [
    ...carriedOverParticipants,
    ...practitionerParticipants,
    ...participatingOrgsPayload,
  ];

  const careTeamId = uuid ? uuid : v4();
  const payload: Omit<IfhirR4.ICareTeam, 'meta'> = {
    ...nonMetaFields,
    resourceType: FHIR_CARE_TEAM,
    identifier: [
      {
        use: 'official',
        value: careTeamId, // uuid
      },
    ],
    id: id ? id : careTeamId,
    name: values.name,
    status: values.status as IfhirR4.CareTeam.StatusEnum,
    participant: allParticipants,
    managingOrganization: managingOrgsReferences,
  };

  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM);
  let successNotificationMessage = t('Successfully added CareTeams');
  if (id) {
    successNotificationMessage = t('Successfully updated CareTeams');
  }
  return await serve
    .update(payload)
    // TODO - possible place to use translation plurals
    .then(() => sendSuccessNotification(successNotificationMessage));
};

/**
 * Util function to build out patient or practitioner name
 *
 * @param {object} obj - patient resource object
 * @returns {string | undefined} - returns patient or practitioner name string
 */
export function getPatientName<T extends { name?: HumanName[] }>(obj?: T | undefined) {
  if (!obj) {
    return '';
  }

  const names = obj.name;
  const officialName = getObjLike(names, 'use', IdentifierUseCodes.OFFICIAL)[0];
  return parseFhirHumanName(officialName);
}

export interface FormFields {
  [uuid]?: string;
  [id]?: string;
  [name]?: string;
  [status]?: string;
  [practitionerParticipants]: string[];
  initialCareTeam?: ICareTeam;
  [organizationParticipants]: string[];
  [managingOrganizations]: string[];
}

export const defaultInitialValues: FormFields = {
  [uuid]: '',
  [id]: '',
  [name]: '',
  [status]: 'active',
  initialCareTeam: undefined,
  [managingOrganizations]: [],
  [organizationParticipants]: [],
  [practitionerParticipants]: [],
};

export const getCareTeamFormFields = (careTeam?: ICareTeam): FormFields => {
  if (!careTeam) {
    return defaultInitialValues;
  }
  const { id, identifier, name, status, participant } = careTeam;
  const officialIdentifier = getObjLike(identifier, 'use', IdentifierUseCodes.OFFICIAL);
  const participantRefs = (participant ?? [])
    .map((participant) => participant.member?.reference)
    .filter((x) => x !== undefined) as string[];
  const practitionerRefs = participantRefs.filter((ref) => {
    return ref.startsWith(practitionerResourceType);
  });
  const organizationRefs = participantRefs.filter((ref) => {
    return ref.startsWith(organizationResourceType);
  });
  const managingOrgsRefs = (careTeam.managingOrganization ?? [])
    .map((ref) => ref.reference)
    .filter((ref) => !!ref) as string[];

  return {
    uuid: get(officialIdentifier, '0.value', undefined),
    id,
    name,
    status,
    initialCareTeam: careTeam,
    practitionerParticipants: practitionerRefs,
    organizationParticipants: organizationRefs,
    managingOrganizations: managingOrgsRefs,
  };
};

export interface SelectOptions {
  value: string;
  label?: string;
}

/**
 * creates util function that given a set of resource ids, it can fetch
 * just those resources whose id are provided
 *
 * @param fhirBaseUrl - fhir base url
 * @param optionsPreprocessor - callback to convert the response data to select options
 */
export function preloadExistingOptionsFactory<ResourceT extends IResource>(
  fhirBaseUrl: string,
  optionsPreprocessor: TransformOptions<ResourceT>
) {
  return async function preloadExistingOptions(values: string[]) {
    const service = new FHIRServiceClass(fhirBaseUrl, '');
    const batchPayload = {
      resourceType: 'Bundle',
      type: 'batch',
      entry: values.map((value) => {
        return {
          request: {
            method: 'GET',
            url: value,
          },
        };
      }),
    };
    return service
      .customRequest({
        method: 'POST',
        body: JSON.stringify(batchPayload),
        url: fhirBaseUrl,
      })
      .then((response) => {
        return getResourcesFromBundle<ResourceT>(response as IBundle).map(
          optionsPreprocessor
        ) as SelectOption<ResourceT>[];
      })
      .catch(() => {
        return [] as SelectOption<ResourceT>[];
      });
  };
}

/**
 * generate a select option from a practitioner resource
 *
 * @param obj - practitioner resource
 */
export const processPractitionerOption = (obj: IPractitioner) => {
  return {
    value: `${obj.resourceType}/${obj.id}`,
    label: getPatientName(obj),
    ref: obj,
  } as SelectOption<IPractitioner>;
};

/**
 * generate a select option from an organization resource
 *
 * @param obj - organization resource
 */
export const processOrganizationOption = (obj: IOrganization) => {
  return {
    value: `${obj.resourceType}/${obj.id}`,
    label: obj.name,
    ref: obj,
  } as SelectOption<IOrganization>;
};
