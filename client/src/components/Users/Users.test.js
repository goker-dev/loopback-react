import React from 'react';
import { shallow } from 'enzyme';
import Users from './Users';

describe('<Users />', () => {
  test('renders', () => {
    const wrapper = shallow(<Users />);
    expect(wrapper).toMatchSnapshot();
  });
});
