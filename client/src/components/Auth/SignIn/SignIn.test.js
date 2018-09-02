import React from 'react';
import { shallow } from 'enzyme';
import SignIn from './SignIn';

describe('<SignIn />', () => {
  test('renders', () => {
    const wrapper = shallow(<SignIn />);
    expect(wrapper).toMatchSnapshot();
  });
});
