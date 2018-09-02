import React from 'react';
import { shallow } from 'enzyme';
import User from './User';

describe('<User />', () => {
  test('renders', () => {
    const wrapper = shallow(<User />);
    expect(wrapper).toMatchSnapshot();
  });
});
