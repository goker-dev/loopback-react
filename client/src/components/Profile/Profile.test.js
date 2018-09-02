import React from 'react';
import { shallow } from 'enzyme';
import Profile from './Profile';

describe('<Profile />', () => {
  test('renders', () => {
    const wrapper = shallow(<Profile />);
    expect(wrapper).toMatchSnapshot();
  });
});
