import React from 'react';
import { Provider } from 'react-redux';
import { authenticateUser } from '@onaio/session-reducer';
import { Route, Router, Switch } from 'react-router';
import nock from 'nock';
import * as reactQuery from 'react-query';
import { waitForElementToBeRemoved, render, cleanup, screen } from '@testing-library/react';
import { store } from '@opensrp/store';
import * as constants from '../../../constants';
import { createMemoryHistory } from 'history';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';
import { ImportDetailViewDetails } from '..';
import { workflows } from '../../ImportListView/tests/fixtures';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('node-fetch');
global.fetch = fetch;

jest.mock('../../../constants', () => {
  return {
    __esModule: true,
    ...Object.assign({}, jest.requireActual('../../../constants')),
    IMPORT_DOMAIN_URI: 'http://localhost',
  };
});

const { QueryClient, QueryClientProvider } = reactQuery;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppWrapper = (props: any) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RoleContext.Provider value={superUserRole}>
          <Switch>
            <Route exact path={`${constants.DATA_IMPORT_DETAIL_URL}/:workflowId`}>
              {(routeProps) => <ImportDetailViewDetails {...{ ...props, ...routeProps }} />}
            </Route>
          </Switch>
        </RoleContext.Provider>
      </QueryClientProvider>
    </Provider>
  );
};

describe('Care Teams list view', () => {
  beforeAll(() => {
    nock.disableNetConnect();
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });
  afterAll(() => {
    nock.enableNetConnect();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    cleanup();
  });

  it('renders correctly', async () => {
    nock(constants.IMPORT_DOMAIN_URI).get('/$import/workflowId').reply(200, workflows[0]).persist();

    const history = createMemoryHistory();
    history.push(`${constants.DATA_IMPORT_DETAIL_URL}/workflowId`);

    render(
      <Router history={history}>
        <AppWrapper />
      </Router>
    );

    await waitForElementToBeRemoved(document.querySelector('.ant-spin'));
    expect(nock.pendingMocks()).toEqual([]);

    expect(
      screen.getByTitle(
        'View details | 26aae779-0e6f-482d-82c3-a0fad1fd3689_orgToLocationAssignment'
      )
    ).toBeInTheDocument();

    expect(
      (document.querySelector('.view-details-container') as HTMLElement).textContent
    ).toMatchSnapshot('innerDetailsText');

    expect(nock.pendingMocks()).toEqual([]);
  });
});
