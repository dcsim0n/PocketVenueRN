/**
|--------------------------------------------------
| Settings component for Venue Devices 
| 2019 Dana Simmonss
|--------------------------------------------------
*/

import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { withDevice } from '../lib/withDevice';
import Slider from '@react-native-community/slider';


 class DeviceSettings extends Component {
  // constructor(props) {
  //   super(props)
    
  //   this.state = {
  //      /* Some settings will go here */
  //      batterySettings: [
  //        {type: "AA Alkaline", warn: 1, alert: 1},
  //        {type: "AA Lithium", warn: 1, alert: 1},
  //        {type: "9V Alkaline", warn: 1, alert: 1},
  //        {type: "9V Lithium", warn: 1, alert: 1}
  //      ]
  //   }
  // }
  
  render() {
    return (
      <View>
        { this.props.preferences.map(( setting ) => (
          <View key={ setting.preferenceKey }>
            <Text>{setting.type}</Text>
            <Text>Warn Level</Text>
            <Slider  minimumValue={0} maximumValue={9} value={setting.warn} />
            <Text>Alert Level</Text>
            <Slider  minimumValue={0} maximumValue={9} value={setting.alert} />
          </View>
        ))}
      </View>
    )
  }
}
export default withDevice(DeviceSettings)
/*
Device Structure
{
  name: "Venue 1",
  address: "192.168.1.1",
  port: "4080",
  type: "VRM2WB"
  settings: {
    battery: {
      0: { //battery types from device
        warnLevel: 12, // red ?
        alertLevel: 14 // yellow ?
      },
      1: {
        {
          warnLevel: 13,
          alertLevel: 15
        }
      }
    }
    refresh: 12 //ms between updates
    scanRate: 12 //ms between scan updates
  }
}
*/
