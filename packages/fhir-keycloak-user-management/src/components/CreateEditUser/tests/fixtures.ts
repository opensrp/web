export const userGroup = [
  { id: '283c5d6e-9b83-4954-9f3b-4c2103e4370c', name: 'Admin', path: '/Admin', subGroups: [] },
  { id: 'a55f0b02-950f-4c6a-9857-667ffbba1dd5', name: 'Admin 2', path: '/Admin 2', subGroups: [] },
  {
    id: '4dd15e66-7132-429b-8939-d1e601611464',
    name: 'New Group',
    path: '/New Group',
    subGroups: [],
  },
  {
    id: '580c7fbf-c201-4dad-9172-1df9faf24936',
    name: 'Super User',
    path: '/Super User',
    subGroups: [],
  },
  {
    id: '2fffbc6a-528d-4cec-aa44-97ef65b9bba2',
    name: 'Test User Group',
    path: '/Test User Group',
    subGroups: [],
  },
];

export const keycloakUser = {
  id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
  createdTimestamp: 1600156317992,
  username: 'opensrp',
  enabled: true,
  totp: false,
  emailVerified: false,
  firstName: 'Demo',
  lastName: 'kenya',
  email: 'test@onatest.com',
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 0,
  access: {
    manageGroupMembership: true,
    view: true,
    mapRoles: true,
    impersonate: false,
    manage: true,
  },
};

export const practitionerSecondaryCoding = {
  coding: [
    {
      system: 'http://hl7.org/fhir/identifier-type',
      code: 'KUID',
      display: 'Keycloak user ID',
    },
  ],
  text: 'Keycloak user ID',
};

export const newPractitioner = {
  resourceType: 'Practitioner',
  id: 'acb9d47e-7247-448f-be93-7a193a5312da',
  identifier: [
    { use: 'official', value: 'acb9d47e-7247-448f-be93-7a193a5312da' },
    {
      use: 'secondary',
      type: practitionerSecondaryCoding,
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  active: true,
  name: [{ use: 'official', family: 'plotus', given: ['flotus'] }],
  telecom: [{ system: 'email', value: 'flotus@plotus.duck' }],
};

export const newPractitionerRole = {
  resourceType: 'PractitionerRole',
  id: 'acb9d47e-7247-448f-be93-7a193a5312da',
  identifier: [
    { use: 'official', value: 'acb9d47e-7247-448f-be93-7a193a5312da' },
    {
      use: 'secondary',
      type: practitionerSecondaryCoding,
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  active: true,
  practitioner: {
    reference: 'Practitioner/c1d36d9a-b771-410b-959e-af2c04d132a2',
    display: 'Demoflotus kenyaplotus',
  },
  code: [
    {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '405623001',
          display: 'Assigned practitioner',
        },
      ],
    },
  ],
};
export const newGroup = {
  resourceType: 'Group',
  id: 'acb9d47e-7247-448f-be93-7a193a5312da',
  identifier: [
    { use: 'official', value: 'acb9d47e-7247-448f-be93-7a193a5312da' },
    {
      use: 'secondary',
      type: practitionerSecondaryCoding,
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  active: true,
  type: 'practitioner',
  actual: true,
  code: {
    coding: [
      { system: 'http://snomed.info/sct', code: '405623001', display: 'Assigned practitioner' },
    ],
  },
  name: 'flotus plotus',
  member: [{ entity: { reference: 'Practitioner/c1d36d9a-b771-410b-959e-af2c04d132a2' } }],
};
export const practitioner = {
  resourceType: 'Bundle',
  id: '30c8715d-c661-4c58-b7f1-303f6e6251c6',
  meta: {
    lastUpdated: '2022-04-05T08:45:53.640+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/_search?_format=json&identifier=c1d36d9a-b771-410b-959e-af2c04d132a2',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/206',
      resource: {
        resourceType: 'Practitioner',
        id: '206',
        meta: {
          versionId: '2',
          lastUpdated: '2021-09-14T07:37:31.213+00:00',
          source: '#74cc383a67268f33',
        },
        identifier: [
          {
            use: 'official',
            value: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
          },
          {
            use: 'secondary',
            type: practitionerSecondaryCoding,
            value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
          },
        ],
        active: false,
        name: [
          {
            use: 'official',
            family: 'Demo',
            given: ['Kenya'],
          },
        ],
        telecom: [
          {
            system: 'email',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const updatedPractitioner = {
  resourceType: 'Practitioner',
  id: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
  identifier: [
    { use: 'official', value: 'c1d36d9a-b771-410b-959e-af2c04d132a2' },
    {
      use: 'secondary',
      type: practitionerSecondaryCoding,
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  active: true,
  name: [{ use: 'official', family: 'kenyaplotus', given: ['Demoflotus'] }],
  telecom: [{ system: 'email', value: 'test@onatest.comflotus@plotus.duck' }],
};

export const extraFieldsPractitioner = {
  resourceType: 'Practitioner',
  id: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
  identifier: [
    { use: 'official', value: 'c1d36d9a-b771-410b-959e-af2c04d132a2' },
    {
      use: 'secondary',
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/identifier-type',
            code: 'KUID',
            display: 'Keycloak user ID',
          },
        ],
        text: 'Keycloak user ID',
      },
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
    {
      use: 'official',
      type: {
        coding: [
          {
            system: 'http://smartregister.org/codes/naitonal_id',
            code: 'NationalID',
            display: 'Naitonal ID',
          },
        ],
        text: 'National ID',
      },
      value: '1234567891011121',
    },
  ],
  active: true,
  name: [{ use: 'official', family: 'kenyaplotus', given: ['Demoflotus'] }],
  telecom: [
    { system: 'email', value: 'test@onatest.comflotus@plotus.duck' },
    { system: 'phone', value: '0700123456', use: 'mobile' },
  ],
};

export const updatedExtraFieldsPractitioner = {
  resourceType: 'Practitioner',
  id: 'acb9d47e-7247-448f-be93-7a193a5312da',
  identifier: [
    { use: 'official', value: 'acb9d47e-7247-448f-be93-7a193a5312da' },
    {
      use: 'secondary',
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/identifier-type',
            code: 'KUID',
            display: 'Keycloak user ID',
          },
        ],
        text: 'Keycloak user ID',
      },
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
    {
      use: 'official',
      type: {
        coding: [
          {
            system: 'http://smartregister.org/codes/naitonal_id',
            code: 'NationalID',
            display: 'Naitonal ID',
          },
        ],
        text: 'National ID',
      },
      value: '1234567891011121',
    },
  ],
  active: true,
  name: [{ use: 'official', family: 'plotus', given: ['flotus'] }],
  telecom: [
    { system: 'email', value: 'flotus@plotus.duck' },
    { system: 'phone', value: '0700123456', use: 'mobile' },
  ],
};

export const group = {
  resourceType: 'Bundle',
  id: 'f20c0276-8364-4e31-ae99-e4bcdb3813ce',
  meta: {
    lastUpdated: '2022-10-14T01:43:51.928+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Group/_search?identifier=cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Group/acb9d47e-7247-448f-be93-7a193a5312da',
      resource: {
        resourceType: 'Group',
        id: 'acb9d47e-7247-448f-be93-7a193a5312da',
        meta: {
          versionId: '2',
          lastUpdated: '2022-10-14T01:40:59.365+00:00',
          source: '#9a5be796c77bd270',
        },
        identifier: [
          {
            use: 'official',
            value: 'acb9d47e-7247-448f-be93-7a193a5312da',
          },
          {
            use: 'secondary',
            value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
          },
        ],
        active: true,
        type: 'practitioner',
        actual: true,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '405623001',
              display: 'Assigned practitioner',
            },
          ],
        },
        name: 'Demoflotus kenyaplotus',
        member: [
          {
            entity: {
              reference: 'Practitioner/206',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const updatedGroup = {
  resourceType: 'Group',
  id: 'acb9d47e-7247-448f-be93-7a193a5312da',
  identifier: [
    {
      use: 'official',
      value: 'acb9d47e-7247-448f-be93-7a193a5312da',
    },
    {
      use: 'secondary',
      type: practitionerSecondaryCoding,
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  active: true,
  type: 'practitioner',
  actual: true,
  code: {
    coding: [
      {
        system: 'http://snomed.info/sct',
        code: '405623001',
        display: 'Assigned practitioner',
      },
    ],
  },
  name: 'Demoflotus kenyaplotus',
  member: [
    {
      entity: {
        reference: 'Practitioner/c1d36d9a-b771-410b-959e-af2c04d132a2',
      },
    },
  ],
};

export const practitionerRoleBundle = {
  resourceType: 'Bundle',
  id: 'bd011ab9-ee83-484e-bdbc-6f76a40724c9',
  meta: {
    lastUpdated: '2022-11-17T22:22:17.387+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/PractitionerRole/_search?identifier=b27939dd-4c8f-44c2-83dd-dc40e494f17d',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/PractitionerRole/38f12000-a066-45ef-8668-65d10e295279',
      resource: {
        resourceType: 'PractitionerRole',
        id: '38f12000-a066-45ef-8668-65d10e295279',
        meta: {
          versionId: '3',
          lastUpdated: '2022-11-11T02:09:31.563+00:00',
          source: '#81c0e33f98658cdd',
        },
        identifier: [
          {
            use: 'official',
            value: '38f12000-a066-45ef-8668-65d10e295279',
          },
          {
            use: 'secondary',
            value: 'b27939dd-4c8f-44c2-83dd-dc40e494f17d',
          },
        ],
        active: true,
        practitioner: {
          reference: 'Practitioner/175ceaa4-0f75-4ab3-a8a7-413cc225f761',
        },
        code: [
          {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '405623001',
                display: 'Assigned practitioner',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const updatedPractitionerRole = {
  resourceType: 'PractitionerRole',
  id: '38f12000-a066-45ef-8668-65d10e295279',
  identifier: [
    { use: 'official', value: '38f12000-a066-45ef-8668-65d10e295279' },
    {
      use: 'secondary',
      type: practitionerSecondaryCoding,
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  active: true,
  practitioner: {
    reference: 'Practitioner/c1d36d9a-b771-410b-959e-af2c04d132a2',
    display: 'Demoflotus kenyaplotus',
  },
  code: [
    {
      coding: [
        {
          system: 'http://snomed.info/sct',
          code: '236321002',
          display: 'Supervisor (occupation)',
        },
      ],
    },
  ],
};

export const compositionResource = {
  resourceType: 'Bundle',
  id: '0b694c63-16fc-4242-89e7-3ecc871be129',
  meta: {
    lastUpdated: '2023-01-31T19:40:53.704+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Composition/_search?_count=1&_elements=identifier%2Ctitle&_getpagesoffset=0&type=http%3A%2F%2Fsnomed.info%2Fsct%7C1156600005',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=0b694c63-16fc-4242-89e7-3ecc871be129&_getpagesoffset=1&_count=1&_pretty=true&_bundletype=searchset&_elements=identifier,title',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Composition/4a5e4d98-9bac-41de-9775-7ca795c3de12',
      resource: {
        resourceType: 'Composition',
        id: '4a5e4d98-9bac-41de-9775-7ca795c3de12',
        meta: {
          versionId: '12',
          lastUpdated: '2022-10-31T15:26:18.785+00:00',
          source: '#49475fbba4633d3c',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        identifier: {
          use: 'official',
          value: 'cha',
        },
        title: 'Device configurations',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
