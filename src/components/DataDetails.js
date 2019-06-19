import React from 'react'
import { View, Text, Picker } from 'react-native'

const blocks = require('../lib/blocks.json')

const DataDetails = (props) => {
    const {label,frequency,voltage,block} = props.navigation.getParam('item')
    
    const freqs = []
    for(let freq = blocks[block].start; freq <= blocks[block].end; freq += .1){
          freqs.push(parseFloat(freq.toFixed(2))) //Avoid javascript floating point addition errors      
    }
    return (
        <View>
            <Text>Label: {label}</Text>
            <Text>Block: {block}</Text>
            <Text>Frequency: {frequency}</Text>
            <Text>Voltage: {voltage}</Text>
            <Picker
                selectedValue={frequency}
                style={{height: 50, width: 100}}
                onValueChange={(itemValue, itemIndex) =>
                    console.log(itemValue)
            }>
                {freqs.map(( freq ) => <Picker.Item label={ freq.toFixed(2) } value={ freq } />)}
            </Picker>
        </View>
    )
}

export default DataDetails
