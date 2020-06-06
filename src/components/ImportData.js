/**
|--------------------------------------------------
| OpenURL component, handles openning and parsing
| FFX xml type files
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { useState, useEffect, Component} from 'react'
import { View, Text , StyleSheet , Picker} from 'react-native'
import {ParseFFX} from '../lib/libFFX'
import alertError from './alertError'

const data = {
  channels: [
    { name: "FFX Import 1"},
    { name: "FFX Import 2"},
    { name: "FFX Import 3"},
    { name: "FFX Import 4"},
    { name: "FFX Import 5"},
    { name: "FFX Import 6"}
  ],

  devices: [
    {
      name: "Venue 1",
      channels: [
        { label: "Channel 1"},
        { label: "Channel 2"},
        { label: "Channel 3"},
        { label: "Channel 4"},
        { label: "Channel 5"},
        { label: "Channel 6"}
      ],
    },
    {
      name: "Venue 2",
      channels:[
        { label: "Channel 1"},
        { label: "Channel 2"},
        { label: "Channel 3"},
        { label: "Channel 4"},
        { label: "Channel 5"},
        { label: "Channel 6"}
      ],
    },
    {
      name: "Venue 3",
      channels:[
        { label: "Channel 1"},
        { label: "Channel 2"},
        { label: "Channel 3"},
        { label: "Channel 4"},
        { label: "Channel 5"},
        { label: "Channel 6"}
      ],
    },
    {
      name: "Venue 4",
      channels:[
        { label: "Channel 1"},
        { label: "Channel 2"},
        { label: "Channel 3"},
        { label: "Channel 4"},
        { label: "Channel 5"},
        { label: "Channel 6"}
      ],
    },
  ]
}

export default class ImportData extends Component<Props> {
    
    constructor(props){
      super(props)
      this.state = {
        channels: [],
        devices: data.devices,
        selectedFreq: 0,
        selectedDevice: 0,
        selectedChannel: 0
      }
    }
  
    selectFreq = ( value ) =>{
      // const deviceIdx = this.state.channels[value].device.index
      // const chanIdx = this.state.channels[value].device.ch
      this.setState({
        selectedFreq: value,
        // selectedDevice: deviceIdx,
        // selectedChannel: chanIdx
      })
    }
    selectDevice = ( value ) =>{
      const newFreq = Object.assign({},this.state.channels[this.state.selectedFreq])
      newFreq.device = { index: value, ch: this.state.selectedChannel }
      const newChannels = this.state.channels.slice()
      newChannels[this.state.selectedFreq] = newFreq
      this.setState({
        channels: newChannels,
        selectedDevice: value
      })
      console.log("New State",this.state);
    }
  
    selectChannel = ( value ) => {
      const newFreq = Object.assign({},this.state.channels[this.state.selectedFreq])
      newFreq.device = {index: this.state.selectedDevice, ch: value}
      const newChannels = this.state.channels.slice()
      newChannels[this.state.selectedFreq] = newFreq
      this.setState({
        channels: newChannels,
        selectedChannel: value
      })
    }
    componentDidMount(){
        const url = this.props.navigation.getParam("url")
        ParseFFX(url)
        .then(ffx => this.setState({channels: ffx.TX}))
        .catch( err => alertError(err));
    }
    render() {
      return (
        <View style={styles.container}>

          {/* Pick the imported frequency to map */}
          {/* Items are imported from an FFX File */}
          <Picker 
          style={{ flex: 1 }}
          selectedValue={this.state.selectedFreq}
          onValueChange={this.selectFreq}
          >
            {this.state.channels.map(( chan,i ) => <Picker.Item label={chan.name}  value={i} />)}
          </Picker>

          {/*  Pick the device to send the selected frequency too */}
          <Picker 
          style={{ flex: 1 }}
          selectedValue={this.state.selectedDevice}
          onValueChange={this.selectDevice}
          >
            {this.state.devices.map(( dev, i) => <Picker.Item label={dev.name} value={i} />)}
          </Picker>

          {/* Pick the device channel to send the selected frequency too */}
          <Picker
          style={{ flex: 1 }}
          selectedValue={this.state.selectedChannel}
          onValueChange={this.selectChannel}
          >
            {this.state.devices[this.state.selectedDevice].channels.map(( chan, i ) => <Picker.Item value={ i } label={ chan.label } />)}
          </Picker>
        </View>
      );
    }
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const mapStateToProps = (state, props) => {
  return {
    ...state,
    ...props
  }
}