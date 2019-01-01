import React from 'react';
import { shallow } from 'enzyme';
import Features from './Features';

describe('<Features />', () => {
  test('renders', () => {
    const wrapper = shallow(<Features />);
    expect(wrapper).toMatchSnapshot();
  });
});
