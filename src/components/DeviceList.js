/**
|--------------------------------------------------
| Pocket Venue: Main Device List
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { Component } from "react";
import uuid from "uuid/v1";
import { connectDevice } from "../lib/connectDevice";
import { View, FlatList, Button, Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import NewDevice from "./NewDevice";
import DeviceListItem from "./DeviceListItem";
import styles from "../stylesheets/appStyles";
import { Icon } from "native-base";

export default class DeviceList extends Component {
  
  state = {
    isEditing: false,
    venues: []
  };
  
  _addNewVenue = venue => {
    console.log(this.state);
    const venues = this.state.venues || []; //Handle empty state with empty array
    venue.key = uuid();
    this.setState({ venues: [venue, ...venues] }, 
      this._storeData
    );
  };

  _onPressItem = deviceData => {
    const device = connectDevice(deviceData);
    this.props.navigation.push("Device", { device });
  };

  _removeDevice = id => {
    const { venues } = this.state;
    this.setState({ venues: venues.filter(({ key }) => key !== id) },
      this._storeData
    );
  };
  
  _toggleEdit = () => {
    console.log("this.state.isEditing :", this.state.isEditing);
    this.setState({ isEditing: !this.state.isEditing });
  };

  _renderItem = ({ item }) => (
    <DeviceListItem
      device={item}
      onPressItem={this._onPressItem}
      removeDevice={this._removeDevice}
      editing={this.state.isEditing}
    />
  );

  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        "@PocketVenue:devices",
        JSON.stringify(this.state.venues)
      );
    } catch (error) {
      Alert.alert("Data Store Error", `${error.name}: ${error.message}`, [
        { text: "OK" }
      ]);
    }
  };

  _readData = async () => {
    try {
      const venues = await AsyncStorage.getItem("@PocketVenue:devices");
      this.setState({ venues: JSON.parse(venues) });
    } catch (error) {
      Alert.alert("Data Store Error", `${error.name}: ${error.message}`, [
        { text: "OK" }
      ]);
    }
  };
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.toolbar}>
          <NewDevice addNewVenue={data => this._addNewVenue(data)} />
          <Icon 
          type="Feather" 
          name="edit" 
          onPress={() => this._toggleEdit()} 
          style={{color: "blue"}}
          />
        </View>

        <FlatList
          contentContainerStyle={styles.listView}
          data={this.state.venues}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
  _openUrl({ url }) {
    console.log("Event:", url);
    this.props.navigation.push("ImportData", { url });
  }

  componentDidMount() {
    this._readData();
    Linking.addEventListener("url", e => this._openUrl(e));
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", e => this._openUrl(e));
  }
}
