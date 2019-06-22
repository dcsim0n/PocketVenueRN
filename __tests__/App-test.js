// /**
//  * @format
//  */

import 'react-native';
import React from 'react';
import App from '../index'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
jest.mock('react-native',()=>({
    AsyncStorage: {
        getItem: ()=>null,
        setItem: ()=>null
    }
}))
it('renders correctly', () => {
  renderer.create(<App />);
});
