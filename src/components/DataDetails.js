import React from 'react'
import { View, Text, Picker } from 'react-native'

const DataDetails = (props) => {
    const {label,frequency,voltage,block} = props.navigation.getParam('item')
    return (
        <View>
            <Text>Label: {label}</Text>
            <Text>Block: {block}</Text>
            <Text>Voltage: {voltage}</Text>
            <Picker
                selectedValue={frequency}
                style={{height: 50, width: 100}}
                onValueChange={(itemValue, itemIndex) =>
                    this.setState({language: itemValue})
            }>
                <Picker.Item label={frequency} value={frequency} />
            </Picker>
        </View>
    )
}

export default DataDetails
