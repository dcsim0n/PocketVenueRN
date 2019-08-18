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

  handleSlide( {setting, value, type} ){
    const newPreference = Object.assign(
      {},
      setting,
      {[type]: value }
      );
      console.log("new preference is: ", newPreference)
      // make new preference array
      // insert newPreference into new preferece array using newPreference.index
      // dispatch newPreferences.
    const newPreferenceList = this.props.preferences.slice() //copy preferences
    newPreferenceList.key = this.props.preferences.key // keep track of the associated devcie key
    newPreferenceList[setting.index] = newPreference  
    this.props.addSetting( newPreferenceList );
  }
  render() {
    return (
      <View>
        { this.props.preferences.map(( setting ) => (
          <View key={ setting.preferenceKey }>
            <Text>{setting.type}</Text>
            <Text>Warn Level</Text>
            <Slider  
             minimumValue={0} 
             maximumValue={9} 
             value={setting.warn} 
             onValueChange={( value ) => this.handleSlide( { setting, value, type:'warn' } )} 
            />
            <Text>Alert Level</Text>
            <Slider  
             minimumValue={0} 
             maximumValue={9} 
             value={setting.alert}
             onValueChange={( value ) => this.handleSlide( { setting, value, type:'alert' } )} 
             />
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
