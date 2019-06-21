/**
|--------------------------------------------------
| Pocket Venue: Main Device List
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { Component } from "react";
import uuid from "uuid/v1";
import { connectDevice } from "../lib/connectDevice";
import { Text, View, FlatList, Button, Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import NewDevice from "./NewDevice";
import DeviceListItem from "./DeviceListItem";
import styles from "../stylesheets/appStyles";

export default class DeviceList extends Component {
  
  state = {
    isEditing: false,
    venues: []
  };

  addNewVenue = venue => {
    console.log(this.state);
    const venues = this.state.venues || []; //Handle empty state with empty array

    venue.key = uuid();

    this.setState({ venues: [venue, ...venues] }, this._storeData);
  };

  _onPressItem = deviceData => {
    const device = connectDevice(deviceData);
    this.props.navigation.push("Device", { device });
  };

  _renderItem = ({ item }) => (
    <DeviceListItem device={item} onPressItem={this._onPressItem} />
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
          <NewDevice addNewVenue={data => this.addNewVenue(data)} />
          <Button title={"Edit"} />
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
    console.log("Event:", url)
    this.props.navigation.push("OpenURL", { url });
  }
  componentDidMount() {
    this._readData();
    Linking.addEventListener("url", e => this._openUrl(e));
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", e => this._openUrl(e));
  }
}
