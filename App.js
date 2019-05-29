/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation'
import {StyleSheet, Text, View, FlatList, Button} from 'react-native';
import NewVenueDialog from './src/NewVeneuDialog'

import styles from './src/stylesheets/appStyles'


class App extends Component {
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
  render() {
    return (
	<View style={{flex: 1}}>
    <View style={styles.toolbar}>
      <NewVenueDialog />
      <Button title={"Edit"}/>
    </View>
    <FlatList
    contentContainerStyle={styles.listView}
    data={this.state.venues}
    renderItem={({item})=><Text style={styles.listItem}>{item.name}</Text>} />
    
	</View>

    )}
}

const AppNavigator = createStackNavigator({
  Home: {
    screen : App
  }
})
export default createAppContainer(AppNavigator)



