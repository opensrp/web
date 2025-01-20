import { getEntryFromBundle, getResourceParentName, getTableData } from '../utils';
import { flatLocations } from '../../../ducks/tests/fixtures';
import { Dictionary } from '@onaio/utils';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';

describe('location-management/src/components/AllLocationListFlat/utils', () => {
  it('getEntryFromBundle works as expected', () => {
    expect(getEntryFromBundle(flatLocations as IBundle)).toEqual(flatLocations.entry);
  });

  it('getTableData works as expected', () => {
    const entries = getEntryFromBundle<BundleEntry>(flatLocations as IBundle);
    expect(getTableData(entries)).toEqual([
      {
        id: '3509',
        key: '3509',
        name: 'Good Health Clinic',
        parent: '',
        status: 'active',
        type: 'Building',
        location: flatLocations.entry[0].resource,
      },
    ]);
  });

  it('getResourceParentName works as expected', () => {
    const parentName = 'Parent Locaton';
    const resource: Dictionary = flatLocations.entry[0].resource;
    resource['partOf'] = {
      reference: 'Location/1',
      display: '',
    };
    const resourcesById = { '1': { id: '1', name: parentName }, '3509': resource };
    expect(getResourceParentName(resource, resourcesById)).toEqual(parentName);
    expect(getResourceParentName(resource, {})).toEqual('');
    expect(getResourceParentName({ partOf: { reference: 'Location/1', display: '' } }, {})).toEqual(
      ''
    );
  });
});
