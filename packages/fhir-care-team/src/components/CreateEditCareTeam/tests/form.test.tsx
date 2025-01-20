import React, { ReactNode } from 'react';
import { CareTeamForm } from '../Form';
import { defaultInitialValues, getCareTeamFormFields } from '../utils';
import { cleanup, fireEvent, waitFor, render, screen } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import * as notifications from '@opensrp/notifications';
import nock from 'nock';
import {
  careTeamResourceType,
  organizationResourceType,
  practitionerResourceType,
} from '../../../constants';
import {
  createdCareTeam2,
  careTeam4201alternativeEdited,
  organizations,
  practitioners,
  careTeam4201alternative,
} from './fixtures';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Router } from 'react-router';
import { createMemoryHistory, MemoryHistory } from 'history';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');
  return {
    ...actual,
    v4: () => '9b782015-8392-4847-b48c-50c11638656b',
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

const AppWrapper = ({
  children,
  history = createMemoryHistory(),
}: {
  children: ReactNode;
  history?: MemoryHistory;
}) => {
  return (
    <Router history={history}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Router>
  );
};

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
      { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
    )
  );
});

afterAll(() => {
  nock.enableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
  jest.resetAllMocks();
});

const props = {
  initialValues: defaultInitialValues,
  fhirBaseURL: 'https://r4.smarthealthit.org/',
};

test('1157 - Create care team works corectly', async () => {
  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const preloadScope = nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '20' })
    .reply(200, organizations)
    .get(`/${practitionerResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '20' })
    .reply(200, practitioners);

  nock(props.fhirBaseURL)
    .put(`/${careTeamResourceType}/${createdCareTeam2.id}`, createdCareTeam2)
    .reply(200)
    .persist();

  render(
    <AppWrapper>
      <CareTeamForm {...props} />
    </AppWrapper>
  );

  await waitFor(() => {
    expect(preloadScope.pendingMocks()).toEqual([]);
  });
  await waitFor(() => {
    expect(screen.getByText(/Create Care Team/)).toBeInTheDocument();
  });

  const nameInput = screen.getByLabelText('Name') as Element;
  userEvents.type(nameInput, 'care team');

  const activeStatusRadio = screen.getByLabelText('Active');
  expect(activeStatusRadio).toBeChecked();

  const inactiveStatusRadio = screen.getByLabelText('Inactive');
  expect(inactiveStatusRadio).not.toBeChecked();
  userEvents.click(inactiveStatusRadio);

  const practitionersInput = screen.getByLabelText('Practitioner Participant');
  fireEvent.mouseDown(practitionersInput);
  fireEvent.click(screen.getByTitle('Ward N 2 Williams MD'));

  const managingOrgsSelect = screen.getByLabelText('Managing organizations');
  fireEvent.mouseDown(managingOrgsSelect);
  fireEvent.click(screen.getByTitle('Test Team 70'));

  const saveBtn = screen.getByRole('button', { name: 'Save' });
  userEvents.click(saveBtn);

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Successfully added CareTeams']]);
  });

  expect(nock.isDone()).toBeTruthy();
});

test('1157 - editing care team works corectly', async () => {
  const thisProps = {
    ...props,
    initialValues: getCareTeamFormFields(careTeam4201alternative),
  };
  const successNoticeMock = jest
    .spyOn(notifications, 'sendSuccessNotification')
    .mockImplementation(() => undefined);

  const preloadScope = nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '20' })
    .reply(200, organizations)
    .get(`/${practitionerResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '20' })
    .reply(200, practitioners)
    .post(`/`, {
      resourceType: 'Bundle',
      type: 'batch',
      entry: [{ request: { method: 'GET', url: 'Organization/368' } }],
    })
    .reply(200, [])
    .post(`/`, {
      resourceType: 'Bundle',
      type: 'batch',
      entry: [{ request: { method: 'GET', url: 'Practitioner/102' } }],
    })
    .reply(200, []);

  nock(props.fhirBaseURL)
    .put(
      `/${careTeamResourceType}/${careTeam4201alternativeEdited.id}`,
      careTeam4201alternativeEdited
    )
    .reply(200)
    .persist();

  render(
    <AppWrapper>
      <CareTeamForm {...thisProps} />
    </AppWrapper>
  );

  await waitFor(() => {
    expect(preloadScope.pendingMocks()).toEqual([]);
  });
  await waitFor(() => {
    expect(screen.getByText(/Edit Care Team /)).toBeInTheDocument();
  });

  const nameInput = screen.getByLabelText('Name') as Element;
  userEvents.type(nameInput, 'care team');

  const activeStatusRadio = screen.getByLabelText('Active');
  expect(activeStatusRadio).toBeChecked();

  const inactiveStatusRadio = screen.getByLabelText('Inactive');
  expect(inactiveStatusRadio).not.toBeChecked();
  userEvents.click(inactiveStatusRadio);

  // remove assigned
  const selectClear = [...document.querySelectorAll('.ant-select-selection-item-remove')];
  expect(selectClear).toHaveLength(2);
  selectClear.forEach((clear) => {
    fireEvent.click(clear);
  });

  const practitionersInput = screen.getByLabelText('Practitioner Participant');
  fireEvent.mouseDown(practitionersInput);

  fireEvent.click(screen.getByTitle('Ward N 1 Williams MD'));

  const managingOrgsSelect = screen.getByLabelText('Managing organizations');
  fireEvent.mouseDown(managingOrgsSelect);
  fireEvent.click(screen.getByTitle('testing ash123'));

  const saveBtn = screen.getByRole('button', { name: 'Save' });
  userEvents.click(saveBtn);

  await waitFor(() => {
    expect(successNoticeMock.mock.calls).toEqual([['Successfully updated CareTeams']]);
  });

  expect(nock.isDone()).toBeTruthy();
});

test('Errors out with message and cancel redirects correctly', async () => {
  const history = createMemoryHistory();
  const errorNoticeMock = jest
    .spyOn(notifications, 'sendErrorNotification')
    .mockImplementation(() => undefined);

  const preloadScope = nock(props.fhirBaseURL)
    .get(`/${organizationResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '20' })
    .reply(200, organizations)
    .get(`/${practitionerResourceType}/_search`)
    .query({ _getpagesoffset: '0', _count: '20' })
    .reply(200, practitioners);

  nock(props.fhirBaseURL)
    .put(`/${careTeamResourceType}/${createdCareTeam2.id}`, createdCareTeam2)
    .replyWithError('Not taking requests at this time')
    .persist();

  render(
    <AppWrapper history={history}>
      <CareTeamForm {...props} />
    </AppWrapper>
  );

  await waitFor(() => {
    expect(preloadScope.pendingMocks()).toEqual([]);
  });
  await waitFor(() => {
    expect(screen.getByText(/Create Care Team/)).toBeInTheDocument();
  });

  const nameInput = screen.getByLabelText('Name') as Element;
  userEvents.type(nameInput, 'care team');

  const activeStatusRadio = screen.getByLabelText('Active');
  expect(activeStatusRadio).toBeChecked();

  const inactiveStatusRadio = screen.getByLabelText('Inactive');
  expect(inactiveStatusRadio).not.toBeChecked();
  userEvents.click(inactiveStatusRadio);

  const practitionersInput = screen.getByLabelText('Practitioner Participant');
  fireEvent.mouseDown(practitionersInput);
  fireEvent.click(screen.getByTitle('Ward N 2 Williams MD'));

  const managingOrgsSelect = screen.getByLabelText('Managing organizations');
  fireEvent.mouseDown(managingOrgsSelect);
  fireEvent.click(screen.getByTitle('Test Team 70'));

  const saveBtn = screen.getByRole('button', { name: 'Save' });
  userEvents.click(saveBtn);

  await waitFor(() => {
    expect(errorNoticeMock.mock.calls).toEqual([['There was a problem creating the Care Team']]);
  });

  // cancel form
  const cancelButton = screen.getByRole('button', {
    name: /cancel/i,
  });
  fireEvent.click(cancelButton);
  expect(history.location.pathname).toEqual('/admin/CareTeams');

  expect(nock.isDone()).toBeTruthy();
});
