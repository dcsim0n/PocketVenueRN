/**
|--------------------------------------------------
| Device HOC wrapper and Connect Function
| 2019 Dana Simmons
|--------------------------------------------------
*/
import React, { Component } from "react";
import { Alert } from "react-native";
import PropTypes from "prop-types";
import DeviceTypes from './deviceTypes'
import { connect } from 'react-redux'
import { addSetting } from '../actions/actions'
let DEVICE = null;

export function withDevice(ComponentToWrap) {
  class Wrapper extends Component {
    constructor(props) {
      super(props);
      this.device = DEVICE
      this.navigation = this.props.navigation;

      this.state = {
        deviceData: [],
        scanData: [],
        refreshRate: 2000
        //TODO: HEY! This is where the global settings can live,
        // but how can we share the state between components?
      };
    }
    handleDeviceData = () => {
      this.setState({ deviceData: this.device.deviceData });
    };
    handleScanData = () => {
      this.setState({ scanData: this.device.scanData });
    };
    navigateWithDevice = ( screenName, params ) => {
      this.navigation.push(screenName, { device: this.device, ...params});
    };
    handleError = error => {
      this.device.stop();
      Alert.alert("Device Error", `${error.name}: ${error.message}`, [
        { text: "OK" }
      ]);
    };
    start = ( refreshRate = this.state.refreshRate, handleData = this.handleDeviceData, handleError = this.handleError) => {
      this.device.start(
        refreshRate,
        handleData,
        handleError
      );
    }
    stop = ( /* any arguments? */ ) =>{
      this.device.stop();
    }
    render() {
      return (
        <ComponentToWrap
          deviceData={this.state.deviceData}
          scanData={this.state.scanData}
          start={this.start}
          stop={this.stop}
          device={this.device}
          navigateWithDevice={this.navigateWithDevice}
          {...this.props}
        />
      );
    }
  }
  Wrapper.propTypes = {
    navigation: PropTypes.object.isRequired
  };
  

  // Pass preferences to ComponentToWrap
  const mapStateToProps = (state, ownProps) => { 
    const activeKey = state.globals.activeVenueKey
    const venues = state.venues
    return {
      preferences: state.venues.filter( venue => venue.key === activeKey )[0].preferences
    }
  }

  const mapDispatchToProps = (dispatch, ownProps) => {
    return {
      addSetting: ( preferences ) => dispatch( addSetting( preferences ))
    }
  }
  // Connect HOC to Redux Store
  return connect(mapStateToProps, mapDispatchToProps)(Wrapper)
}

//Factory function for instantiating new device
//DEVICE is the global connected device
//TODO: refactor to allow multiple devices to be connected at once
export function connectDevice(options){
    const {type} = options
    const { device, preferences  } = DeviceTypes[type].initialize( options )
    DEVICE = device
    return { device, preferences }
}