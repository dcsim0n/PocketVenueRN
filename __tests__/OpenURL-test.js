import 'react-native';
import React from 'react';
import OpenURL from '../src/components/OpenURL'

import renderer from 'react-test-renderer';

const navigation = {
    getParam: ()=>"Hello World"
}
test('Renders properly', ()=>{
    renderer.create(<OpenURL navigation={navigation} />);
})