/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { QueryClientProvider, QueryClient } from 'react-query';
import { Router, Route, Switch } from 'react-router';
import { TableLayout } from '../../components/TableLayout';
import { useServerSideActionsDataGrid } from '../useServerSideActionsDataGrid';
import nock from 'nock';
import { dataPage1, dataPage2, emptyPage, searchData } from './fixtures';
import userEvents from '@testing-library/user-event';
import { Input } from 'antd';
import { renderHook, act } from '@testing-library/react-hooks';
import flushPromises from 'flush-promises';

const history = createMemoryHistory();

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const rQClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
  },
});

// TODO - boiler plate
store.dispatch(
  authenticateUser(
    true,
    {
      email: 'bob@example.com',
      name: 'Bobbie',
      username: 'RobertBaratheon',
    },
    { api_token: 'hunter2', oAuth2Data: { access_token: 'bamboocha', state: 'abcde' } }
  )
);

// we first setup the wrapper components, somewhere to run the hooks during tests
const options = {
  baseUrl: 'http://example.com',
  endpoint: 'data',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchForm = (props: any) => {
  const { onChangeHandler, ...otherProps } = props;

  return (
    <div className="search-input-wrapper">
      <Input onChange={onChangeHandler} {...otherProps}></Input>
    </div>
  );
};

// minimal app to wrap our hook.
const SampleApp = () => {
  const { tablePaginationProps, queryValues, searchFormProps } = useServerSideActionsDataGrid(
    options.baseUrl,
    options.endpoint
  );

  const { data, isFetching, isLoading } = queryValues;

  const columns = [
    {
      title: 'Name/Id',
      dataIndex: 'title',
      width: '20%',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableProps: any = {
    datasource: data?.records ?? [],
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (
    <div>
      <SearchForm {...searchFormProps} data-testid="search-form" />
      <TableLayout {...tableProps} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App = (props: any) => {
  return (
    <Switch>
      <Route exact path="/qr">
        <QueryClientProvider client={rQClient}>{props.children}</QueryClientProvider>
      </Route>
    </Switch>
  );
};

// we now setup the tests
beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
});

afterEach(() => {
  nock.cleanAll();
  cleanup();
});

test('pagination and search work correctly', async () => {
  const history = createMemoryHistory();
  history.push('/qr');

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, dataPage1)
    .persist();

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 20,
      _count: 20,
    })
    .reply(200, dataPage2)
    .persist();

  nock(options.baseUrl)
    .get(`/${options.endpoint}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
      'name:contains': '345',
    })
    .reply(200, searchData)
    .persist();

  render(
    <Router history={history}>
      <App>
        <SampleApp />
      </App>
    </Router>
  );

  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  const waitForSpinner = async () => {
    return await waitFor(() => {
      expect(document.querySelector('.ant-spin')).toBeInTheDocument();
    });
  };

  await waitFor(() => {
    expect(screen.getByText(/NSW Government My Personal Health Record/)).toBeInTheDocument();
  });

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 1`);
    });
  });

  fireEvent.click(screen.getByTitle('2'));

  expect(history.location.search).toEqual('?pageSize=20&page=2');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  expect(screen.getByText(/426 - title/)).toBeInTheDocument();
  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`table row ${idx} page 2`);
    });
  });

  // works with search as well.
  const searchForm = document.querySelector('[data-testid="search-form"]') as Element;
  userEvents.type(searchForm, '345');

  expect(history.location.search).toEqual('?pageSize=20&page=1&search=345');

  await waitForSpinner();
  await waitForElementToBeRemoved(document.querySelector('.ant-spin'));

  document.querySelectorAll('tr').forEach((tr, idx) => {
    tr.querySelectorAll('td').forEach((td) => {
      expect(td).toMatchSnapshot(`Search ${idx} page 1`);
    });
  });

  // remove search.
  userEvents.clear(searchForm);
  expect(history.location.search).toEqual('?pageSize=20&page=1');

  expect(nock.pendingMocks()).toEqual([]);
});

test('useServerSideActionDataGrid hook work for sort state', async () => {
  history.push('/');

  const wrapper = ({ children }) => (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <QueryClientProvider client={rQClient}>
              <div>{children}</div>
            </QueryClientProvider>
          </Route>
        </Switch>
      </Router>
    </>
  );
  const fhirBaseURL = 'https://test.server';
  const resourceType = 'Location';

  nock(fhirBaseURL)
    .get(`/${resourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, emptyPage)
    .persist();
  nock(fhirBaseURL)
    .get(`/${resourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _sort: 'name',
      _count: 20,
    })
    .reply(200, { ...emptyPage, entry: [{ status: 'ascend' }] });
  nock(fhirBaseURL)
    .get(`/${resourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _sort: '-name',
      _count: 20,
      // _summary: "count"
    })
    .reply(200, { ...emptyPage, entry: [{ status: 'descend' }] });

  const { result } = renderHook(
    () =>
      useServerSideActionsDataGrid(fhirBaseURL, resourceType, {}, (x) => {
        return x.entry as any;
      }),
    { wrapper }
  );

  // check initial state
  expect(result.error).toBeUndefined();
  expect(result.current.sortOptions).toMatchObject({
    updateSortParams: expect.any(Function),
    getControlledSortProps: expect.any(Function),
    currentParams: {},
    sortState: {},
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({
      records: [],
      total: 0,
    });
  });
  // gets a column's controlled props from empty state
  const controlledSortProps = result.current.sortOptions.getControlledSortProps('nonExistent');
  expect(controlledSortProps).toEqual({});

  act(() => {
    result.current.sortOptions.updateSortParams({
      name: {
        paramAccessor: 'name',
        order: 'descend',
      },
    });
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({
      records: [
        {
          status: 'descend',
        },
      ],
      total: 0,
    });
  });

  // gets a column's controlled props from empty state
  const nameColumnSortProps = result.current.sortOptions.getControlledSortProps('name');
  expect(nameColumnSortProps).toEqual({
    sortDirections: ['ascend', 'descend'],
    sortOrder: 'descend',
    sorter: true,
  });
  expect(result.current.sortOptions.sortState).toEqual({
    name: {
      order: 'descend',
      paramAccessor: 'name',
    },
  });
  expect(result.current.sortOptions.currentParams).toEqual({
    _count: 20,
    _getpagesoffset: 0,
    _sort: '-name',
    _total: 'accurate',
  });

  // with name sorted in ascend
  act(() => {
    result.current.sortOptions.updateSortParams({
      name: {
        paramAccessor: 'name',
        order: 'ascend',
      },
    });
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({
      records: [
        {
          status: 'ascend',
        },
      ],

      total: 0,
    });
  });
  expect(result.current.sortOptions.sortState).toEqual({
    name: {
      order: 'ascend',
      paramAccessor: 'name',
    },
  });
  expect(result.current.sortOptions.currentParams).toEqual({
    _count: 20,
    _getpagesoffset: 0,
    _total: 'accurate',
    _sort: 'name',
  });

  // update sort state
  act(() => {
    result.current.sortOptions.updateSortParams({
      name: undefined,
    });
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({ records: [], total: 0 });
  });
  expect(result.current.sortOptions.sortState).toEqual({});
  expect(result.current.sortOptions.currentParams).toEqual({
    _count: 20,
    _getpagesoffset: 0,
    _total: 'accurate',
  });

  expect(nock.pendingMocks()).toEqual([]);

  // expect(current.sParams.toString()).toEqual('');
  // const params = {
  //   key: 'value',
  //   key1: 'value1',
  //   key2: 'value2',
  // };
  // current.addParams(params);
  // expect(current.sParams.toString()).toEqual('key=value&key1=value1&key2=value2');

  // //Test that when we call addParams to an existing key we replace it instead of appending
  // current.addParam('key1', 'newValue3');
  // expect(current.sParams.toString()).toEqual('key=value&key1=newValue3&key2=value2');

  // expect(history.location).toMatchObject({
  //   hash: '',
  //   key: expect.any(String),
  //   pathname: '/qr',
  //   search: '?key=value&key1=newValue3&key2=value2',
  //   state: undefined,
  // });

  // current.removeParam('key1');
  // expect(current.sParams.toString()).toEqual('key=value&key2=value2');
  // expect(history.location).toMatchObject({
  //   hash: '',
  //   key: expect.any(String),
  //   pathname: '/qr',
  //   search: '?key=value&key2=value2',
  //   state: undefined,
  // });
});

test('useServerSideActionDataGrid retains initial sort values', async () => {
  history.push('/');

  const wrapper = ({ children }) => (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <QueryClientProvider client={rQClient}>
              <div>{children}</div>
            </QueryClientProvider>
          </Route>
        </Switch>
      </Router>
    </>
  );
  const fhirBaseURL = 'https://test.server';
  const resourceType = 'Location';

  nock(fhirBaseURL)
    .get(`/${resourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _sort: 'name',
      _count: 20,
    })
    .reply(200, { ...emptyPage, entry: [{ status: 'ascend' }] });

  const { result } = renderHook(
    () =>
      useServerSideActionsDataGrid(
        fhirBaseURL,
        resourceType,
        {},
        (x) => {
          return x.entry as any;
        },
        {
          name: {
            paramAccessor: 'name',
            order: 'ascend',
          },
        }
      ),
    { wrapper }
  );

  // check initial state
  expect(result.error).toBeUndefined();
  expect(result.current.sortOptions).toMatchObject({
    updateSortParams: expect.any(Function),
    getControlledSortProps: expect.any(Function),
    currentParams: {},
    sortState: {},
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({
      records: [
        {
          status: 'ascend',
        },
      ],
      total: 0,
    });
  });
  // gets a column's controlled props from empty state
  const controlledSortProps = result.current.sortOptions.getControlledSortProps('name');
  expect(controlledSortProps).toEqual({
    sortDirections: ['ascend', 'descend'],
    sortOrder: 'ascend',
    sorter: true,
  });

  expect(nock.isDone).toBeTruthy();
});

test('useServerSideActionDataGrid hook work for filter state', async () => {
  history.push('/');

  const wrapper = ({ children }) => (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <QueryClientProvider client={rQClient}>
              <div>{children}</div>
            </QueryClientProvider>
          </Route>
        </Switch>
      </Router>
    </>
  );
  const fhirBaseURL = 'https://test.server';
  const resourceType = 'Location';

  nock(fhirBaseURL)
    .get(`/${resourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
    })
    .reply(200, emptyPage)
    .persist();
  nock(fhirBaseURL)
    .get(`/${resourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
      name: 'pet',
    })
    .reply(200, { ...emptyPage, entry: [{ filter: 'name:pet' }] });

  const { result } = renderHook(
    () =>
      useServerSideActionsDataGrid(fhirBaseURL, resourceType, {}, (x) => {
        return x.entry as any;
      }),
    { wrapper }
  );

  // check initial state
  expect(result.error).toBeUndefined();
  expect(result.current.filterOptions).toMatchObject({
    updateFilterParams: expect.any(Function),
    currentParams: {},
    currentFilters: {},
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({
      records: [],
      total: 0,
    });
  });

  // add filter
  act(() => {
    result.current.filterOptions.updateFilterParams({
      name: {
        paramAccessor: 'name',
        rawValue: 'pet',
        paramValue: 'pet',
      },
    });
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({
      records: [
        {
          filter: 'name:pet',
        },
      ],
      total: 0,
    });
  });
  expect(result.current.filterOptions.currentFilters).toEqual({
    name: {
      paramValue: 'pet',
      rawValue: 'pet',
      paramAccessor: 'name',
    },
  });
  expect(result.current.filterOptions.currentParams).toEqual({
    _count: 20,
    _getpagesoffset: 0,
    name: 'pet',
    _total: 'accurate',
  });

  // update filter by removing it
  act(() => {
    result.current.filterOptions.updateFilterParams({
      name: undefined,
    });
  });
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({ records: [], total: 0 });
  });
  expect(result.current.sortOptions.sortState).toEqual({});
  expect(result.current.sortOptions.currentParams).toEqual({
    _count: 20,
    _getpagesoffset: 0,
    _total: 'accurate',
  });

  expect(nock.pendingMocks()).toEqual([]);
});

test('useServerSideActionDataGrid retains initial filter values', async () => {
  history.push('/');

  const wrapper = ({ children }) => (
    <>
      <Router history={history}>
        <Switch>
          <Route exact path="/">
            <QueryClientProvider client={rQClient}>
              <div>{children}</div>
            </QueryClientProvider>
          </Route>
        </Switch>
      </Router>
    </>
  );
  const fhirBaseURL = 'https://test.server';
  const resourceType = 'Location';

  nock(fhirBaseURL)
    .get(`/${resourceType}/_search`)
    .query({
      _total: 'accurate',
      _getpagesoffset: 0,
      _count: 20,
      name: 'pet',
    })
    .reply(200, { ...emptyPage, entry: [{ filter: 'name:pet' }] });

  const { result } = renderHook(
    () =>
      useServerSideActionsDataGrid(
        fhirBaseURL,
        resourceType,
        {},
        (x) => {
          return x.entry as any;
        },
        undefined,
        {
          name: {
            paramAccessor: 'name',
            rawValue: 'pet',
            paramValue: 'pet',
          },
        }
      ),
    { wrapper }
  );

  // check initial state
  await flushPromises();
  await waitFor(() => {
    // confirm that the request resolved
    expect(result.current.queryValues.error).toBeNull();
    expect(result.current.queryValues.data).toEqual({
      records: [
        {
          filter: 'name:pet',
        },
      ],
      total: 0,
    });
  });
  expect(result.current.filterOptions.currentFilters).toEqual({
    name: {
      paramValue: 'pet',
      rawValue: 'pet',
      paramAccessor: 'name',
    },
  });
  expect(result.current.filterOptions.currentParams).toEqual({
    _count: 20,
    _getpagesoffset: 0,
    name: 'pet',
    _total: 'accurate',
  });

  expect(nock.isDone).toBeTruthy();
});
