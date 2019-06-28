import 'react-native';
import React from 'react';
import ImportData from '../src/components/ImportData'

import renderer from 'react-test-renderer';

const navigation = {
    getParam: ()=>"Hello World"
}

test('Renders properly', ()=>{
    renderer.create(<ImportData navigation={navigation} />);
})