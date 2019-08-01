/**
|--------------------------------------------------
| Device HOC wrapper and Connect Function
| 2019 Dana Simmons
|--------------------------------------------------
*/
import React, { Component } from "react";
import { Alert } from "react-native";
import PropTypes from "prop-types";
import VRWB from './libVRWB' 
import VRM2WB from './libVRM2WB'
import Dummy from './libDummy'
import DeviceTypes from './deviceTypes'
import { connect } from 'react-redux'

let DEVICE = null;

export function withDevice(ComponentToWrap) {
  class Wrapper extends Component {
    constructor(props) {
      super(props);
      this.device = DEVICE
      this.navigation = this.props.navigation;
      this.blurListener = this.navigation.addListener(
        "willBlur",
        this.componentWillBlur
      );
      this.focusListener = this.navigation.addListener(
        "didFocus",
        this.componentDidFocus
      );
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

    componentDidFocus = () => {
      console.log("focusing");
      this.device.start(
        this.state.refreshRate,
        this.handleDeviceData,
        this.handleError
      );
    };

    componentWillBlur = () => {
      console.log("blurring..");
      this.device.stop();
    };
    componentWillUnmount() {
      this.blurListener.remove();
      this.focusListener.remove();
    }
    render() {
      return (
        <ComponentToWrap
          deviceData={this.state.deviceData}
          scanData={this.state.scanData}
          device={this.device}
          navigateWithDevice={this.navigateWithDevice}
          settings={this.props.settings}
          {...this.props}
        />
      );
    }
  }
  Wrapper.propTypes = {
    navigation: PropTypes.object.isRequired
  };
  
  const mapStateToProps = (state, ownProps) => {
    const activeKey = state.globals.activeVenueKey
    const venues = state.venues
    return {
      settings: state.venues.filter( venue => venue.key === activeKey )
    }
  }
  // Connect HOC to Redux Store
  return connect(mapStateToProps)(Wrapper)
}




//Factory function for instantiating new device

export function connectDevice(options){
    const {type} = options
    switch (type) {
        case DeviceTypes.VRM2WB:
            DEVICE = new VRM2WB(options)
            break;
        case DeviceTypes.VRWB:
            DEVICE = new VRWB(options)
            break;
        case DeviceTypes.TEST:
            DEVICE = new Dummy(options)
            break;
        default:
            return null
    }
    return DEVICE
}