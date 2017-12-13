import React from 'react';
import { shallow, configure } from 'enzyme';
import App from '../../app/components/App';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('App Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });
  
  it('should have one heading', () => {
    expect(wrapper.find('#heading').type()).toEqual('h2');
  });
});