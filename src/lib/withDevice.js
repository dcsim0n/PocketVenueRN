/**
|--------------------------------------------------
| Device HOC wrapper
| 2019 Dana Simmons
|--------------------------------------------------
*/
import React, { Component } from "react";
import { Alert } from "react-native";
import PropTypes from "prop-types";
import { connect } from 'react-redux'

function withDevice(ComponentToWrap) {
  class Wrapper extends Component {
    constructor(props) {
      super(props);
      this.navigation = this.props.navigation;
      this.device = this.navigation.getParam("device");
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
    navigateWithDevice = screenName => {
      this.navigation.push(screenName, { device: this.device });
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
    return {
      settings: state.settings
    }
  }
  // Connect HOC to Redux Store
  return connect(mapStateToProps)(Wrapper)
}

export default withDevice
