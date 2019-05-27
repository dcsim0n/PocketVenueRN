/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import VenueItem from './src/VenueItem'


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      venues: [
        {key: 'a', name: "Venue 1", address: "127.0.0.1", port: 4080},
        {key: 'b', name: "Venue 2", address: "127.0.0.2", port: 4080},
	{key: 'c', name: "Venue 3", address: "" , port: 0}
      ]
    }
  }
  render() {
    return (
	<View style={{flex:1}}>
        <Text>More Tests</Text>
	<FlatList
	style={{paddingTop:100, flex:1}} 
        data={this.state.venues}
        renderItem={(item)=><VenueItem title={item.name}/>} />
	<Text>This is a test {this.state.venues[0].name}</Text>
	</View>

    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen : App
  }
})

export default createAppContainer(AppNavigator)

