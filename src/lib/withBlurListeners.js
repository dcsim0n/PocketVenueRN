/**
|--------------------------------------------------
| Add Blur Listeners to any component
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { PropTypes } from 'prop-types';

export default class WithBlurListeners extends Component {
  constructor(props) {
    super(props)
    this.device = props.device
    this.navigation = props.navigation
    this.state = {
       
    }
    this.blurListener = this.navigation.addListener(
      "willBlur",
      this.componentWillBlur
    );
    this.focusListener = this.navigation.addListener(
      "didFocus",
      this.componentDidFocus
    );
  }
  
  componentDidFocus = () => {
    console.log("focusing");
    this.device.start(
      //Where do these callbacks come from?
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
      { ...this.props.children }
    )
  }
}

WithBlurListeners.PropTypes = {
  device: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};