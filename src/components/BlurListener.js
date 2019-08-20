/**
|--------------------------------------------------
| Add Blur Listeners to any component
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { Component } from 'react';
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
    this.props.start( /* override defaults here */ );
  };
  componentWillBlur = () => {
    console.log("blurring..");
    this.props.stop();
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

WithBlurListeners.propTypes = {
  device: PropTypes.object.isRequired,
  start: PropTypes.object.isRequired,
  stop: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};