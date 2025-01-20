export const centralProvince = {
  resourceType: 'Location',
  id: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
  meta: {
    versionId: '2',
    lastUpdated: '2024-03-18T20:28:06.623+00:00',
  },
  extension: [
    {
      url: 'http://build.fhir.org/extension-location-boundary-geojson.html',
      valueAttachment: {
        data: 'ewogICAgICAgICAgInR5cGUiOiAiUG9seWdvbiIsCiAgICAgICAgICAiY29vcmRpbmF0ZXMiOiBbCiAgICAgICAgICAgIFsKICAgICAgICAgICAgICBbCiAgICAgICAgICAgICAgICA1OS45NDE0MDYyNDk5OTk5OSwKICAgICAgICAgICAgICAgIDUwLjY1Mjk0MzM2NzI1NzA5CiAgICAgICAgICAgICAgXSwKICAgICAgICAgICAgICAvLyBtb3JlIHBvaW50c+KApgogICAgICAgICAgICAgIFsKICAgICAgICAgICAgICAgIDU5Ljk0MTQwNjI0OTk5OTk5LAogICAgICAgICAgICAgICAgNTAuNjUyOTQzMzY3MjU3MDkKICAgICAgICAgICAgICBdCiAgICAgICAgICAgIF0KICAgICAgICAgIF0KICAgICAgICB9',
      },
    },
  ],
  identifier: [
    {
      use: 'official',
      value: '0b91d619-c6d0-4f6e-adcf-d570f0e70313',
    },
  ],
  status: 'active',
  name: 'Central Province',
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'jdn',
        display: 'Jurisdiction',
      },
    ],
  },
  partOf: {
    reference: 'Location/fe9e549b-a427-4db6-aad9-edade11b6e6a',
    display: 'True Kenya',
  },
};

export const centralProviceChildLocations = {
  resourceType: 'Bundle',
  id: '71fcd33c-1a3d-458c-826a-682bb8316e25',
  meta: {
    lastUpdated: '2024-03-18T20:39:31.389+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Location/_search?partof=d9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Location/46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
      resource: {
        resourceType: 'Location',
        id: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
        meta: {
          versionId: '2',
          lastUpdated: '2024-03-15T11:22:00.906+00:00',
          source: '#e44992bad25b9584',
        },
        identifier: [
          {
            use: 'official',
            value: 'd1aab054-4e19-4407-ae4b-1b15e03102f2',
          },
        ],
        status: 'active',
        name: 'Kiambu County',
        physicalType: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
              code: 'bu',
              display: 'Building',
            },
          ],
        },
        type: [
          {
            coding: [
              {
                system: 'https://smartregister.org/codes/administrative-level',
                code: '1',
                display: 'Level 1',
              },
            ],
          },
        ],
        partOf: {
          reference: 'Location/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
          display: 'Central Province',
        },
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const centralInventory = {
  resourceType: 'Bundle',
  id: '0c6df6c7-efca-455d-aa35-fff29b3b32ba',
  meta: {
    lastUpdated: '2024-03-19T09:30:08.187+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/List?_format=json&_include=List%3Aitem&_include%3Arecurse=Group%3Amember&subject=46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/List/33ebbca2-8cdf-4b95-954a-349181cea0f6',
      resource: {
        resourceType: 'List',
        id: '33ebbca2-8cdf-4b95-954a-349181cea0f6',
        meta: {
          versionId: '2',
          lastUpdated: '2024-03-12T13:42:11.440+00:00',
          source: '#07acdad6c717a701',
        },
        status: 'current',
        title: 'Kiambu Inventory Item',
        code: {
          coding: [
            {
              system: 'http://smartregister.org/codes',
              code: '22138876',
              display: 'Supply Inventory List',
            },
          ],
          text: 'Supply Inventory List',
        },
        subject: {
          reference: 'Location/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
        },
        entry: [
          {
            flag: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '22138876',
                  display: 'Supply Inventory List',
                },
              ],
              text: 'Supply Inventory List',
            },
            date: '2024-02-01T00:00:00.00Z',
            item: {
              reference: 'Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
            },
          },
          {
            flag: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '22138876',
                  display: 'Supply Inventory List',
                },
              ],
              text: 'Supply Inventory List',
            },
            date: '2024-02-01T00:00:00.00Z',
            item: {
              reference: 'Group/1277894c-91b5-49f6-a0ac-cdf3f72cc3d5',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/52cffa51-fa81-49aa-9944-5b45d9e4c117',
      resource: {
        resourceType: 'Group',
        id: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
        meta: {
          versionId: '6',
          lastUpdated: '2024-03-19T08:02:37.882+00:00',
          source: '#21929fd0045c4c68',
        },
        identifier: [
          {
            use: 'secondary',
            value: '606109db-5632-48c5-8710-b726e1b3addf',
          },
          {
            use: 'official',
            value: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
          },
        ],
        active: true,
        type: 'substance',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Bed nets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '23435363',
                  display: 'Attractive Item code',
                },
              ],
            },
            valueBoolean: false,
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373',
                  display: 'Is it there code',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '34536373-1',
                  display: 'Value entered on the It is there code',
                },
              ],
              text: 'yes',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Is it in good condition? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484-1',
                  display: 'Value entered on the Is it in good condition? (optional)',
                },
              ],
              text: 'Yes, no tears, and inocuated',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595',
                  display: 'Is it being used appropriately? (optional)',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '56758595-1',
                  display: 'Value entered on the Is it being used appropriately? (optional)',
                },
              ],
              text: 'Hanged at correct height and covers averagely sized beds',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '67869606',
                  display: 'Accountability period (in months)',
                },
              ],
            },
            valueQuantity: {
              value: 12,
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '1231415',
                  display: 'Product Image code',
                },
              ],
            },
            valueReference: {
              reference: 'Binary/24d55827-fbd8-4b86-a47a-2f5b4598c515',
            },
          },
        ],
      },
      search: {
        mode: 'include',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/1277894c-91b5-49f6-a0ac-cdf3f72cc3d5',
      resource: {
        resourceType: 'Group',
        id: '1277894c-91b5-49f6-a0ac-cdf3f72cc3d5',
        meta: {
          versionId: '2',
          lastUpdated: '2024-03-12T13:31:06.796+00:00',
          source: '#db11b850758a4929',
        },
        active: true,
        type: 'substance',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://smartregister.org/codes',
              code: '78991122',
              display: 'Supply Inventory',
            },
          ],
        },
        name: 'Kiambu -- Bed nets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '98734231',
                  display: 'Unicef Section',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'Health',
                  display: 'Health',
                },
              ],
              text: 'Health',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Donor',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'GAVI',
                  display: 'GAVI',
                },
              ],
              text: 'GAVI',
            },
          },
        ],
        member: [
          {
            entity: {
              reference: 'Group/52cffa51-fa81-49aa-9944-5b45d9e4c117',
            },
            period: {
              start: '2024-02-01T00:00:00.00Z',
              end: '2024-02-01T00:00:00.00Z',
            },
            inactive: false,
          },
        ],
      },
      search: {
        mode: 'include',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
      resource: {
        resourceType: 'Group',
        id: 'e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
        meta: {
          versionId: '1',
          lastUpdated: '2024-03-12T12:41:07.119+00:00',
          source: '#8472f6d4e7ffa4f0',
        },
        active: true,
        type: 'substance',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://smartregister.org/codes',
              code: '78991122',
              display: 'Supply Inventory',
            },
          ],
        },
        name: 'Kiambu -- Bed nets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '09887657',
                  display: 'Delivery and Accountability',
                },
              ],
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '98734231',
                  display: 'Unicef Section',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'Health',
                  display: 'Health',
                },
              ],
              text: 'Health',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Donor',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'GAVI',
                  display: 'GAVI',
                },
              ],
              text: 'GAVI',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '33467722',
                  display: 'Product reference',
                },
              ],
            },
            valueReference: {
              reference: 'Group/52cffa51-fa81-49aa-9944-5b45d9e4c117',
            },
          },
        ],
      },
      search: {
        mode: 'include',
      },
    },
  ],
};

export const emptyBundleResponse = {
  resourceType: 'Bundle',
  id: '2f9c651c-0435-46d9-ab53-80e0d574fe05',
  meta: {
    lastUpdated: '2024-03-20T11:34:23.450+00:00',
  },
  type: 'searchset',
  total: 0,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Group?_id=1277894c-91b5-49f6-a0ac-cdf3df72cc3d5&_include=Group%3Amember',
    },
  ],
};

export const centralEdgeCaseInventory = {
  resourceType: 'Bundle',
  id: '0c6df6c7-efca-455d-aa35-fff29b3b32ba',
  meta: {
    lastUpdated: '2024-03-19T09:30:08.187+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/List?_format=json&_include=List%3Aitem&_include%3Arecurse=Group%3Amember&subject=46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/List/33ebbca2-8cdf-4b95-954a-349181cea0f6',
      resource: {
        resourceType: 'List',
        id: '33ebbca2-8cdf-4b95-954a-349181cea0f6',
        meta: {
          versionId: '2',
          lastUpdated: '2024-03-12T13:42:11.440+00:00',
          source: '#07acdad6c717a701',
        },
        status: 'current',
        title: 'Kiambu Inventory Item',
        code: {
          coding: [
            {
              system: 'http://smartregister.org/codes',
              code: '22138876',
              display: 'Supply Inventory List',
            },
          ],
          text: 'Supply Inventory List',
        },
        subject: {
          reference: 'Location/d9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
        },
        entry: [
          {
            flag: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '22138876',
                  display: 'Supply Inventory List',
                },
              ],
              text: 'Supply Inventory List',
            },
            date: '2024-02-01T00:00:00.00Z',
            item: {
              reference: 'Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
            },
          },
          {
            flag: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '22138876',
                  display: 'Supply Inventory List',
                },
              ],
              text: 'Supply Inventory List',
            },
            date: '2024-02-01T00:00:00.00Z',
            item: {
              reference: 'Group/1277894c-91b5-49f6-a0ac-cdf3f72cc3d5',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/52cffa51-fa81-49aa-9944-5b45d9e4c117',
      resource: {
        resourceType: 'Group',
        id: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
        meta: {
          versionId: '6',
          lastUpdated: '2024-03-19T08:02:37.882+00:00',
          source: '#21929fd0045c4c68',
        },
        identifier: [
          {
            use: 'secondary',
            value: '606109db-5632-48c5-8710-b726e1b3addf',
          },
          {
            use: 'official',
            value: '52cffa51-fa81-49aa-9944-5b45d9e4c117',
          },
        ],
        active: true,
        type: 'substance',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '386452003',
              display: 'Supply management',
            },
          ],
        },
        name: 'Bed nets',
      },
      search: {
        mode: 'include',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/1277894c-91b5-49f6-a0ac-cdf3f72cc3d5',
      resource: {
        resourceType: 'Group',
        id: '1277894c-91b5-49f6-a0ac-cdf3f72cc3d5',

        identifier: [
          {
            use: 'official',
            type: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'SERNUM',
                  display: 'Serial Number',
                },
              ],
              text: 'Serial Number',
            },
            value: '1111',
          },
          {
            use: 'secondary',
            type: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'PONUM',
                  display: 'PO Number',
                },
              ],
              text: 'PO Number',
            },
            value: '1111',
          },
          {
            use: 'usual',
            value: '5667347f-d404-46f6-b7b2-f08ccf122f8f',
          },
        ],
        meta: {
          versionId: '2',
          lastUpdated: '2024-03-12T13:31:06.796+00:00',
          source: '#db11b850758a4929',
        },
        active: true,
        type: 'substance',
        actual: false,
        code: {},
        name: 'Kiambu -- Bed nets',
        characteristic: [
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '98734231',
                  display: 'Unicef Section',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'Health',
                  display: 'Health',
                },
              ],
              text: 'Health',
            },
          },
          {
            code: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: '45647484',
                  display: 'Donor',
                },
              ],
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://smartregister.org/codes',
                  code: 'GAVI',
                  display: 'GAVI',
                },
              ],
              text: 'GAVI',
            },
          },
        ],
        member: [
          {
            entity: {
              reference: 'Group/52cffa51-fa81-49aa-9944-5b45d9e4c117',
            },
            period: {
              start: '20-24-02-01T00:00:00.00Z', // wrong formatted data.
              end: '2024-02-01T00:00:00.00Z',
            },
            inactive: false,
          },
        ],
      },
      search: {
        mode: 'include',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
      resource: {
        resourceType: 'Group',
        id: 'e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
        meta: {
          versionId: '1',
          lastUpdated: '2024-03-12T12:41:07.119+00:00',
          source: '#8472f6d4e7ffa4f0',
        },
        active: true,
        type: 'substance',
        actual: false,
        code: {
          coding: [
            {
              system: 'http://smartregister.org/codes',
              code: '78991122',
              display: 'Supply Inventory',
            },
          ],
        },
        name: 'Kiambu -- Bed nets',
      },
      search: {
        mode: 'include',
      },
    },
  ],
};
