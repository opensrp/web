import { history } from '@onaio/connected-reducer-registry';
import { Helmet } from 'react-helmet';
import { Router } from 'react-router';
import { Home } from '../Home';
import { store } from '@opensrp/store';
import { Provider } from 'react-redux';
import { cleanup, render, screen } from '@testing-library/react';
import { authenticateUser } from '@onaio/session-reducer';
import React from 'react';
import { RoleContext } from '@opensrp/rbac';
import { superUserRole } from '@opensrp/react-utils';

jest.mock('../../../../configs/env');
jest.mock('../../../../configs/settings');

describe('containers/pages/Home', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders Home correctly & changes Title of page', () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <Home />
        </Router>
      </Provider>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('OpenSRP Web');
    screen.getByText(/Missing the required permissions to view data on this page/i);
  });

  it('renders Home correctly & changes Title of page 2', () => {
    store.dispatch(
      authenticateUser(
        true,
        { email: 'bob@example.com', name: 'Bobbie', username: 'RobertBaratheon' },
        {
          roles: ['ROLE_VIEW_KEYCLOAK_USERS'],
          username: 'superset-user',
          user_id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
        }
      )
    );
    const envModule = require('../../../../configs/env');
    envModule.ENABLE_TEAMS_ASSIGNMENT_MODULE = true;
    envModule.ENABLE_FHIR_USER_MANAGEMENT = true;
    envModule.ENABLE_FHIR_LOCATIONS = true;
    envModule.ENABLE_FHIR_TEAMS = true;
    render(
      <Provider store={store}>
        <Router history={history}>
          <RoleContext.Provider value={superUserRole}>
            <Home />
          </RoleContext.Provider>
        </Router>
      </Provider>
    );

    const helmet = Helmet.peek();
    expect(helmet.title).toEqual('OpenSRP Web');
    const links = document.querySelectorAll('.admin-link');
    expect(Array.from(links).map((x) => x.textContent)).toEqual([
      'User Management',
      'Location Management',
      'Organization Management',
      'Questionnaire Management',
      'Data Imports',
    ]);
    links.forEach((link) => {
      expect(link).toMatchSnapshot(link.textContent ?? undefined);
    });
  });
});
