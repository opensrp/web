import React from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { ServicePointProfile } from '..';
import { store } from '@opensrp/store';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { INVENTORY_SERVICE_POINT_PROFILE_VIEW } from '../../../constants';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import {
  deforest,
  fetchTree,
  hierarchyReducer,
  hierarchyReducerName,
  removeLocationUnits,
} from '@opensrp/location-management';
import {
  fetchCalls,
  inventories,
  madagascar,
  madagascarTree,
  opensrpBaseURL,
  structures,
} from './fixtures';
import { authenticateUser } from '@onaio/session-reducer';
import toJson from 'enzyme-to-json';
reducerRegistry.register(hierarchyReducerName, hierarchyReducer);

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    servicePointId: 'f3199af5-2eaf-46df-87c9-40d59606a2fb',
  }),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const history = createBrowserHistory();

const props = {
  opensrpBaseURL,
  history,
  location: {
    hash: '',
    pathname: `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}`,
    search: '',
    state: {},
  },
  match: {
    isExact: true,
    params: '',
    path: `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}`,
    url: `${INVENTORY_SERVICE_POINT_PROFILE_VIEW}`,
  },
};

store.dispatch(
  authenticateUser(
    true,
    {
      email: 'bob@example.com',
      name: 'Bobbie',
      username: 'RobertBaratheon',
    },
    // eslint-disable-next-line @typescript-eslint/camelcase
    { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
  )
);

describe('Profile view Page', () => {
  afterEach(() => {
    fetch.resetMocks();
    store.dispatch(deforest());
    store.dispatch(removeLocationUnits());
  });

  it('renders correctly', async () => {
    fetch.once(JSON.stringify([])).once(JSON.stringify([])).once(JSON.stringify([]));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    expect(fetch.mock.calls.map((call) => call[0])).toEqual([
      'https://test-example.com/rest/location/getAll?serverVersion=0&is_jurisdiction=false',
      'https://test-example.com/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
      'https://test-example.com/rest/stockresource/servicePointId/f3199af5-2eaf-46df-87c9-40d59606a2fb',
    ]);
  });

  it('renders when data is present', async () => {
    store.dispatch(fetchTree(madagascarTree));
    fetch
      .once(JSON.stringify(structures))
      .once(JSON.stringify([madagascar]))
      .once(JSON.stringify(inventories));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();
    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // check fetch calls made
    expect(fetch.mock.calls).toEqual(fetchCalls);
  });

  it('shows broken page', async () => {
    const errorMessage = 'Coughid';
    fetch.mockReject(new Error(errorMessage));

    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <ServicePointProfile {...props}></ServicePointProfile>
        </Router>
      </Provider>
    );

    /** loading view */
    expect(toJson(wrapper.find('.ant-spin'))).toBeTruthy();

    await act(async () => {
      await new Promise((resolve) => setImmediate(resolve));
      wrapper.update();
    });

    // no data
    expect(wrapper.text()).toMatchSnapshot('error broken page');
  });
});
