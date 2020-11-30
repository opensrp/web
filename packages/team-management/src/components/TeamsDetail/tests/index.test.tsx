import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import React from 'react';
import flushPromises from 'flush-promises';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { store } from '@opensrp/store';
import TeamsDetail, { Props } from '..';

describe('containers/pages/Home', () => {
  const props: Props = {
    active: true,
    id: 1,
    identifier: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
    name: 'The Luang',
    type: {
      coding: [
        {
          code: 'team',
          display: 'Team',
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
        },
      ],
    },
    teamMembers: [
      {
        active: false,
        identifier: '718e2b7d-22d7-4c23-aaa7-62cca4b9e318',
        name: 'prac one',
        userId: '7306784c-64fb-4d45-990b-306863eb478b',
        username: 'prac_1',
      },
    ],
  };

  it('renders without crashing', () => {
    const wrapper = mount(<TeamsDetail {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('removes it self on close', () => {
    const wrapper = mount(<TeamsDetail {...props} onClose={() => wrapper.unmount()} />);
    expect(wrapper.children()).toHaveLength(1);
    wrapper.find('button').simulate('click');
    expect(wrapper).toHaveLength(0);
  });
  // it('doesnt close if onClose prop is not set', () => {
  //   const wrapper = mount(
  //     <Provider store={store}>
  //       <TeamsDetail {...props} />
  //     </Provider>
  //   );
  //   expect(wrapper.children()).toHaveLength(1);
  //   wrapper.find('button').simulate('click');
  //   expect(wrapper).toHaveLength(1);
  // });
});
