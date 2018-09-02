import React from 'react';
import { shallow } from 'enzyme';
import NoMatch from './NoMatch';

describe('<NoMatch />', () => {
  test('renders', () => {
    const wrapper = shallow(<NoMatch />);
    expect(wrapper).toMatchSnapshot();
  });
});
