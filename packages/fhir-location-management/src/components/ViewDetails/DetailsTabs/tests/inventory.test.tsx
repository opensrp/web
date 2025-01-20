/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClient, QueryClientProvider } from 'react-query';
import nock from 'nock';
import {
  render,
  cleanup,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Router, Switch, Route } from 'react-router';
import { Provider } from 'react-redux';
import { centralEdgeCaseInventory, centralProvince } from './fixtures';
import { createMemoryHistory } from 'history';
import { listResourceType } from '@opensrp/fhir-helpers';
import { superUserRole } from '@opensrp/react-utils';
import { RoleContext } from '@opensrp/rbac';
import _ from 'lodash';
import { InventoryView } from '../Inventory';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.setTimeout(10000);
nock.disableNetConnect();

const props = {
  fhirBaseUrl: 'http://test.server.org',
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <RoleContext.Provider value={superUserRole}>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route exact path={`/profile/:id`}>
              <InventoryView {...props} />
            </Route>
          </Switch>
        </QueryClientProvider>
      </RoleContext.Provider>
    </Provider>
  );
};

beforeAll(() => {
  store.dispatch(
    authenticateUser(
      true,
      {
        email: 'bob@example.com',
        name: 'Bobbie',
        username: 'RobertBaratheon',
      },
      { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
    )
  );
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

afterAll(() => {
  nock.enableNetConnect();
});

test('inventory view broken data', async () => {
  const history = createMemoryHistory();
  history.push(`profile/${centralProvince.id}`);

  const thisProps = {
    ...props,
    locationId: centralProvince.id,
  };

  nock(props.fhirBaseUrl)
    .get(`/${listResourceType}/_search`)
    .query({
      subject: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
      _include: 'List:item',
      '_include:recurse': 'Group:member',
      _summary: 'count',
    })
    .reply(200, { total: 1 })
    .persist();

  nock(props.fhirBaseUrl)
    .get(`/${listResourceType}/_search`)
    .query({
      subject: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
      _include: 'List:item',
      '_include:recurse': 'Group:member',
      _count: '1',
    })
    .reply(200, centralEdgeCaseInventory)
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...thisProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  screen.getByText(/Add Inventory/i);

  // There is a table that has this data.
  const inventoryTab = document.querySelector('[data-testid="inventory-tab"]')!;
  const checkedRadio = document.querySelector('.ant-radio-button-wrapper-checked');
  expect(checkedRadio?.textContent).toEqual('Active');

  // check records shown in table.
  const tableData = [...inventoryTab.querySelectorAll('table tbody tr')].map(
    (tr) => tr.textContent
  );
  expect(tableData).toEqual(['Edit']);

  expect(nock.isDone()).toBeTruthy();
});

test('Errors out correctly', async () => {
  const history = createMemoryHistory();
  history.push(`profile/${centralProvince.id}`);

  const thisProps = {
    ...props,
    locationId: centralProvince.id,
  };

  nock(props.fhirBaseUrl)
    .get(`/${listResourceType}/_search`)
    .query({
      subject: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334',
      _include: 'List:item',
      '_include:recurse': 'Group:member',
      _summary: 'count',
    })
    .replyWithError('Its not you, its the server.')
    .persist();

  render(
    <Router history={history}>
      <AppWrapper {...thisProps}></AppWrapper>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
  await waitFor(() => {
    screen.getByRole('alert');
  });

  expect(nock.isDone()).toBeTruthy();
});
