import React from 'react';
import { shallow } from 'enzyme';
import Welcome from './Welcome';

describe('<Welcome />', () => {
  test('renders', () => {
    const wrapper = shallow(<Welcome />);
    expect(wrapper).toMatchSnapshot();
  });
});
