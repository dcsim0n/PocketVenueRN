// /**
//  * @format
//  */

import 'react-native';
import React from 'react';
import App from '../index'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
describe.skip("App component",()=>{
    test("Tries to render successfully",()=>{
        renderer.create(<App />)
    })

})

