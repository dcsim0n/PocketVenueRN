/**
|--------------------------------------------------
| OpenURL component, handles openning and parsing
| FFX xml type files
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import {ParseFFX} from '../lib/libFFX'
import alertError from './alertError'


export default class ImportData extends Component<Props> {
    // Need to add this functionality  
    // const url = props.navigation.getParam("url")
    // const [txList, setTxList] = useState(null)
    
    // useEffect(( ) => {
    //     if(txList === null){
    //         ParseFFX(url)
    //         .then(ffx => setTxList(ffx.TX))
    //     }
        
    // })

    // console.log(url)
    state = {
      channels: data.channels,
      devices: data.devices,
      selectedFreq: 0,
      selectedDevice: 0,
      selectedChannel: 0
    }
  
    selectFreq = ( value ) =>{
      const deviceIdx = this.state.channels[value].device.index
      const chanIdx = this.state.channels[value].device.ch
      this.setState({
        selectedFreq: value,
        selectedDevice: deviceIdx,
        selectedChannel: chanIdx
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
        const url = props.navigation.getParam("url")
        ParseFFX(url)
        .then(ffx => this.setState({ffx.TX))
    }
    render() {
      return (
        <View style={styles.container}>
          <Picker 
          style={{ flex: 1 }}
          selectedValue={this.state.selectedFreq}
          onValueChange={this.selectFreq}
          >
            {this.state.channels.map(( chan,i ) => <Picker.Item label={chan.label}  value={i} />)}
          </Picker>
  
          <Picker 
          style={{ flex: 1 }}
          selectedValue={this.state.selectedDevice}
          onValueChange={this.selectDevice}
          >
            {this.state.devices.map(( dev, i) => <Picker.Item label={dev.name} value={i} />)}
          </Picker>
  
          <Picker
          style={{ flex: 1 }}
          selectedValue={this.state.selectedChannel}
          onValueChange={this.selectChannel}
          >
            {this.state.devices[this.state.selectedDevice].channels.map(( chan, i ) => <Picker.Item value={ i } label={ chan } />)}
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
