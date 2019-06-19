import React from 'react'
import { View, Text, Picker, TextInput, Button } from 'react-native'
import Slider from '@react-native-community/slider'
import styles from '../stylesheets/appStyles'

const blocks = require('../lib/blocks.json')

const BatteryTypes = { //TODO: this is different for each device, implement as class property
    0: "AA Alkaline",
    1: "AA Lithium",
    2: "9V Alkaline",
    3: "9V Lithium"
}

const DataDetails = (props) => {
    const {label,frequency,voltage, block, batteryType, outLevel, index} = props.navigation.getParam('item')
    
    const freqs = []
    for(let freq = blocks[block].start; freq <= blocks[block].end; freq += .1){
          freqs.push(parseFloat(freq.toFixed(2))) //Avoid javascript floating point addition errors      
    }
    return (
        <View style={styles.container}>
                <Text style={styles.baseText}>Ch: {index}, Label: </Text>
                <TextInput 
                    value={ label }
                    style={[styles.textInput, {textAlign: 'center'}]}
                />
                <Text style={styles.baseText}>Block: {block}</Text>
                <Text style={styles.baseText}>Voltage: {voltage} V</Text>
            
            
            <View style={{ flex: 1, flexDirection: 'row'}}>
                <Picker
                    selectedValue={frequency}
                    style={{height: 50, flex:1 }}
                    onValueChange={(itemValue, itemIndex) =>
                        console.log(itemValue)
                }>
                    {freqs.map(( freq ) => <Picker.Item key={ freq } label={ freq.toFixed(2) + ' MHz' } value={ freq } />)}
                </Picker>

                <Picker 
                    selectedValue={batteryType}
                    style={{height: 50, flex: 1}}
                    onValueChange={() => console.log("TODO: Change Battery Type")}
                >
                    {Object.keys(BatteryTypes).map(( key ) => <Picker.Item key={ key } label={ BatteryTypes[key] } value={ key } />)} 
                </Picker>
            </View>

            <View style={styles.container}> 
                <Text>Channel Output Level: {/* Output Level */} </Text>
                <Slider 
                    width={ 200 } 
                    minimumValue={ -15 } 
                    maximumValue={ 8 } 
                    value={ outLevel } 
                    onValueChange={()=>console.log("TODO: Change output level")} 
                />
            <Button title="Apply Changes" onPress={()=>console.log("TODO: Apply changes")} />
            </View>

        </View>
    )
}

export default DataDetails
