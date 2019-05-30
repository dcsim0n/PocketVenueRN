/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
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
        {key: 'a', name: "Venue 1", address: "127.0.0.1", port: 4080},
        {key: 'b', name: "Venue 2", address: "127.0.0.2", port: 4080},
        {key: 'c', name: "Venue 3", address: "" , port: 0}
      ]
    }
  }
  
  addNewVenue(venue){
    const {venues} = this.state
    this.setState({venues:[...venues, venue]})
  }
  _onPressItem = (device) =>{
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





