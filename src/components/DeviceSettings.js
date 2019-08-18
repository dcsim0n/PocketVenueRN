/**
|--------------------------------------------------
| Settings component for Venue Devices 
| 2019 Dana Simmonss
|--------------------------------------------------
*/

import React, { Component } from "react";
import { Text, View } from "react-native";
import { withDevice } from "../lib/withDevice";
import Slider from "@react-native-community/slider";

class DeviceSettings extends Component {
  //TODO: add local state values to improve slider performance,
  // only dispatch redux action on onSlideComplete.
  handleSlide({ key, value, type }) { // <-- here type is the "type" of value: "warn", "alert", etc.. 
                                      // key is the "prefernce key"
    const newPreference = Object.assign(
      // Merge new value into old preference
      {},
      this.props.preferences[key],
      { [type]: value }
    );

    const newPreferences = Object.assign(
      // Merge new preference into old preference(s)
      {},
      this.props.preferences,
      { [key]: newPreference }
    );

    console.log("Created new preferences:", newPreferences);
    this.props.addSetting(newPreferences);
  }

  render() {
    return (
      <View>
        {Object.keys(this.props.preferences).map(key => ( // <-- here key is the battery type "0", "1", etc..
          <View key={key}>
            <Text>{this.props.preferences[key].name}</Text>
            <Text>Warn Level</Text>
            <Slider
              minimumValue={0}
              maximumValue={9}
              value={this.props.preferences[key].warn}
              onValueChange={value =>
                this.handleSlide({ key, value, type: "warn" })
              }
            />
            <Text>Alert Level</Text>
            <Slider
              minimumValue={0}
              maximumValue={9}
              value={this.props.preferences[key].alert}
              onValueChange={value =>
                this.handleSlide({ key, value, type: "alert" })
              }
            />
          </View>
        ))}
      </View>
    );
  }
}
export default withDevice(DeviceSettings);
/*
Device Structure
{
  name: "Venue 1",
  address: "192.168.1.1",
  port: "4080",
  type: "VRM2WB"
  preferences: {
    0: { //battery types from device
      warnLevel: 12, // red ?
      alertLevel: 14 // yellow ?
    },
    1: {
      {
        warnLevel: 13,
        alertLevel: 15
      }
    },
    refresh: 12, //ms between updates
    scanRate: 12, //ms between scan updates
  }
}
*/
