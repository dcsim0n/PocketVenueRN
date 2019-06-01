/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import uuid from 'uuid/v1';
import DeviceTypes from '../lib/deviceTypes'
import {connectDevice} from '../lib/connectDevice'
import {Text, View, FlatList, Button} from 'react-native';
import NewDevice from './NewDevice'
import DeviceListItem from './DeviceListItem'

import styles from '../stylesheets/appStyles'


export default class DeviceList extends Component {
  constructor(props){
    super(props)
    this.state = {
      isEditing: false,
      venues: [
        {key: '557560ab-a789-4ec8-8fdc-ed9d29080402', type: DeviceTypes.VRWB, name: "Venue 1", address: "127.0.0.1", port: 4080},
        {key: 'd470be85-783a-43e5-bf8e-a051a002683c', type: DeviceTypes.VRWB, name: "Venue 2", address: "127.0.0.2", port: 4080},
        {key: '5440f3d9-8a5d-494d-bf79-544266c4e768', type: DeviceTypes.VRM2WB, name: "Venue 3", address: "10.0.0.10" , port: 4999}
      ]
    }
  }
  
  addNewVenue(venue){
    const {venues} = this.state
    venue.key = uuid()
    this.setState({venues:[...venues, venue]})
  }
  _onPressItem = (deviceData) =>{
    const device = connectDevice(deviceData)
    this.props.navigation.push("Details",{device})
  }
  _renderItem = ({item}) =>(
    <DeviceListItem
        device={item}
        onPressItem={this._onPressItem}/>
  )
  
  render() {
    return (
	<View style={{flex: 1}}>
    <View style={styles.toolbar}>
      <NewDevice 
        addNewVenue={(data)=>this.addNewVenue(data)}/>
      <Button title={"Edit"}/>
    </View>

    <FlatList
    contentContainerStyle={styles.listView}
    data={this.state.venues}
    renderItem={this._renderItem} />
    
	</View>

    )}
}





