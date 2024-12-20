import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { history } from '@onaio/connected-reducer-registry';
import { Provider } from 'react-redux';
import { MemoryRouter, RouteComponentProps, Router } from 'react-router';
import fetch from 'jest-fetch-mock';
import { store } from '@opensrp/store';
import App from '../App';
import { CallbackComponent, LoadingComponent, SuccessfulLoginComponent } from '../fhir-apps';
import { expressAPIResponse } from './fixtures';
import { mount } from 'enzyme';
import { authenticateUser } from '@onaio/session-reducer';
import * as serverLogout from '@opensrp/server-logout';
import { QueryClient, QueryClientProvider } from 'react-query';
import flushPromises from 'flush-promises';
import { getOpenSRPUserInfo } from '@onaio/gatekeeper';
import {
  ADD_EDIT_COMMODITY_URL,
  CommodityAddEdit,
  CommodityList,
  LIST_COMMODITY_URL,
} from '@opensrp/fhir-group-management';
import { viewDetailsQuery, ContextProvider, superUserRole } from '@opensrp/react-utils';
import { RoleContext } from '@opensrp/rbac';

jest.mock('../../configs/env');

const realLocation = window.location;

// tslint:disable-next-line: no-var-requires

describe('App - unauthenticated', () => {
  beforeEach(() => {
    window.location = realLocation;
    fetch.mockResponse(JSON.stringify(expressAPIResponse));
    // Reset history
    history.push('/');
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ContextProvider>
        <App />
      </ContextProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  <ContextProvider>
    <App />
  </ContextProvider>;

  it('integration: renders App correctly', async () => {
    const wrapper = mount(
      <ContextProvider>
        <App />
      </ContextProvider>
    );
    // before resolving get oauth state request, the user is logged out
    expect(wrapper.text()).toMatchInlineSnapshot(`"AdministrationData ImportsLogin"`);

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // after resolving get oauth state request superset user is logged in
    expect(wrapper.find('Router').prop('history')).toMatchObject({
      location: {
        pathname: '/login',
      },
    });
    wrapper.unmount();
  });

  it('Callback component Renders correctly', async () => {
    const routeProps = {
      history,
      location: {
        hash: '',
        pathname: '/',
        search: '?next=%2F',
        state: {},
      },
      match: {
        params: { id: 'OpenSRP' },
      },
    } as RouteComponentProps<{ id: string }>;

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/` }]}>
          <CallbackComponent {...routeProps} />
        </MemoryRouter>
      </Provider>
    );
    wrapper.update();
    expect(wrapper.exists('CallbackComponent')).toBeTruthy();
    wrapper.unmount();
  });

  it('Loading component Renders correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/` }]}>
          <LoadingComponent />
        </MemoryRouter>
      </Provider>
    );
    wrapper.update();
    expect(wrapper.exists('LoadingComponent')).toBeTruthy();
    wrapper.unmount();
  });

  it('Successful Login component Renders correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/` }]}>
          <SuccessfulLoginComponent />
        </MemoryRouter>
      </Provider>
    );
    wrapper.update();
    expect(wrapper.exists('SuccessfulLoginComponent')).toBeTruthy();
    wrapper.unmount();
  });
});

describe('App - authenticated', () => {
  beforeAll(() => {
    const jwtAccessToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHZ0NjX3c0UG9Gd25vbThILXpQMEQ4UTc1ZjZ1LWdHLUJTZV9Xc1QxSkU0In0.eyJleHAiOjE2NTg3MzQyMTcsImlhdCI6MTY1ODczNDE1NywiYXV0aF90aW1lIjoxNjU4NzM0MTUxLCJqdGkiOiJkZmNhNDExOS05NDViLTQ5ZDYtOWI2Mi00OGM1OTcwNWZhMGQiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLXN0YWdlLnNtYXJ0cmVnaXN0ZXIub3JnL2F1dGgvcmVhbG1zL29wZW5zcnAtd2ViLXN0YWdlIiwiYXVkIjpbInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6ImRiOTAwOTJmLWI5ODMtNGYyNi1iMTI5LWRhZGRhZjAyMzg0ZiIsInR5cCI6IkJlYXJlciIsImF6cCI6Im9wZW5zcnAtc3RhZ2Utc2VydmVyIiwic2Vzc2lvbl9zdGF0ZSI6Ijk1NjIyZDM3LTE3NTctNDJkMy05ZWRhLWRhOTkxMjExNTNlYSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3dlYi5vbi1wcmVtaXNlLms4cy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vb3BlbnNycC5vbi1wcmVtaXNlLms4cy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vc3VwZXJzZXQtb2F1dGgtZGVtby5yaXZlcnMub25hbGFicy5vcmciLCJodHRwczovL3dlYi5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnLyoiLCJodHRwOi8vbG9jYWxob3N0OjkwOTAvKiIsImh0dHBzOi8vemVpci5zbWFydHJlZ2lzdGVyLm9yZy8qIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyoiLCJodHRwOi8vd2ViLnplaXIuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHBzOi8vb3BlbnNycC1zdGFnZS1zZW50aW5lbC5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnLyoiLCJodHRwczovL3dlYi5vcGVuc3JwLXN0YWdlLnNtYXJ0cmVnaXN0ZXIub3JnIiwiaHR0cHM6Ly9maGlyLmxhYnMuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwczovL29wZW5zcnAtc3RhZ2UubGFicy5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHBzOi8vd2ViLndlbGxuZXNzcGFzcy1wcmV2aWV3LnNtYXJ0cmVnaXN0ZXIub3JnLyIsImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImh0dHBzOi8vb3BlbnNycC1zdGFnZS5zbWFydHJlZ2lzdGVyLm9yZyIsImh0dHA6Ly8xOTIuMTY4LjEwMC4yOjgwODAvKiIsImh0dHBzOi8vd2ViLnplaXIuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwOi8vd2ViLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly8xNzIuMjAuMTI3LjIzMTo5MDkwLyoiLCJodHRwczovL2ZoaXItd2ViLm9wZW5zcnAtc3RhZ2Uuc21hcnRyZWdpc3Rlci5vcmciLCJodHRwOi8vZmhpci5sYWJzLnNtYXJ0cmVnaXN0ZXIub3JnIiwiaHR0cDovL29wZW5zcnAub24tcHJlbWlzZS5rOHMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly9vcGVuc3JwLXN0YWdlLXNlbnRpbmVsLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly9vcGVuc3JwLXN0YWdlLmxhYnMuc21hcnRyZWdpc3Rlci5vcmcvKiIsImh0dHA6Ly93ZWIub24tcHJlbWlzZS5rOHMuc21hcnRyZWdpc3Rlci5vcmciXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIk1BTkFHRV9SRVBPUlRTIiwiT1BFTk1SUyIsInJlYWxtLWFkbWluIiwiRURJVF9LRVlDTE9BS19VU0VSUyIsIlZJRVdfS0VZQ0xPQUtfVVNFUlMiLCJQTEFOU19GT1JfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJBTExfRVZFTlRTIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJtYW5hZ2UtdXNlcnMiLCJ2aWV3LXVzZXJzIiwicXVlcnktZ3JvdXBzIiwicXVlcnktdXNlcnMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIHJlYWQgcHJvZmlsZSB3cml0ZSBlbWFpbCIsInNpZCI6Ijk1NjIyZDM3LTE3NTctNDJkMy05ZWRhLWRhOTkxMjExNTNlYSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkRlbW8gVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6ImRlbW8iLCJnaXZlbl9uYW1lIjoiRGVtbyIsImZhbWlseV9uYW1lIjoiVXNlciJ9.AhC1rYONG37Er8YUw0OvEM6h3FqaFYFBN845kOZN2bFo8_x3kpaWuZ5qGGxh8LfPqnMsjnpkL4dXD_3E8uTvjBZBFIeLdck2RaYmxoPXK7j0lDnf4ia36oz2TKUVSBDijacNFdmxmVbyeddFcN6ZPluzO9bvgFkIqIEyCwrLLZEnZwsUdUlgfD4V_ebwkOcSH0z69AkQprZSRPksd5CsY8cPqqDYNRhjRBNqvBdcxtlPwv48Mtpau4rs3yucYKahscNolVAkE_FetEI0KenZdYV5g9N3VdneCsjW4DdZkcuZDrKaA6g64gBUyXEptRsL4wYPwup4_G5NU8vrD-L2cA';

    const { authenticated, user, extraData } = getOpenSRPUserInfo({
      oAuth2Data: {
        access_token: jwtAccessToken,
        state: 'opensrp',
        token_expires_at: '2017-07-13T20:30:59.000Z',
        token_type: 'bearer',
      },
    });

    store.dispatch(authenticateUser(authenticated, user, extraData));
  });

  beforeEach(() => {
    window.location = realLocation;
    // Reset history
    history.push('/');
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <ContextProvider>
        <App />
      </ContextProvider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('integration: renders App correctly', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router history={history}>
          <RoleContext.Provider value={superUserRole}>
            <App />
          </RoleContext.Provider>
        </Router>
      </Provider>
    );
    // before resolving get oauth state request, the user is logged out
    expect(wrapper.text()).toMatchInlineSnapshot(
      `"AdministrationData ImportsdemoWelcome to OpenSRPUser ManagementQuestionnaire ManagementData Imports"`
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // after resolving get oauth state request superset user is logged in
    expect(wrapper.find('Router').prop('history')).toMatchObject({
      location: {
        pathname: '/',
      },
    });
    wrapper.unmount();
  });

  it('correctly logs out user', async () => {
    const mock = jest.spyOn(serverLogout, 'logout');
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: `/logout` }]}>
          <RoleContext.Provider value={superUserRole}>
            <App />
          </RoleContext.Provider>
        </MemoryRouter>
      </Provider>
    );
    await act(async () => {
      await flushPromises();
      wrapper.update();
    });
    expect(mock).toHaveBeenCalled();
  });

  it('commodity routes are correctly registered', async () => {
    const envModule = require('../../configs/env');
    envModule.ENABLE_FHIR = 'true';
    // redirecting to certain routes renders the correct page
    const queryClient = new QueryClient();

    const wrapper = mount(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter initialEntries={[{ pathname: `${LIST_COMMODITY_URL}` }]}>
            <RoleContext.Provider value={superUserRole}>
              <App />
            </RoleContext.Provider>
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    await act(async () => {
      await flushPromises();
      wrapper.update();
    });

    // start with the list component

    expect(wrapper.find(CommodityList)).toHaveLength(1);

    // go to the profile view)
    (wrapper.find('Router').prop('history') as RouteComponentProps['history']).push(
      `${LIST_COMMODITY_URL}?${viewDetailsQuery}=1`
    );
    wrapper.update();
    expect(wrapper.find('ViewDetailsWrapper')).toHaveLength(1);

    // go to new resource page
    (wrapper.find('Router').prop('history') as RouteComponentProps['history']).push(
      `${ADD_EDIT_COMMODITY_URL}`
    );

    wrapper.update();
    expect(wrapper.find(CommodityAddEdit)).toHaveLength(1);

    // go to edit resource page
    (wrapper.find('Router').prop('history') as RouteComponentProps['history']).push(
      `${ADD_EDIT_COMMODITY_URL}/1`
    );
    wrapper.update();
    expect(wrapper.find(CommodityAddEdit)).toHaveLength(1);
    wrapper.unmount();
  });
});
