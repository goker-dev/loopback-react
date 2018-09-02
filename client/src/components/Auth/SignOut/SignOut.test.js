import React from 'react';
import { shallow } from 'enzyme';
import SignOut from './SignOut';

describe('<SignOut />', () => {
  test('renders', () => {
    const wrapper = shallow(<SignOut />);
    expect(wrapper).toMatchSnapshot();
  });
});
