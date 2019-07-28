/**
|--------------------------------------------------
| Pocket Venue: Main Device List
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { Component } from "react";
import { connectDevice } from "../lib/connectDevice";
import { FlatList, Alert, Linking } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import NewDevice from "./NewDevice";
import DeviceListItem from "./DeviceListItem";
import { Header, Icon, Container, Content, Left, Body, Right, Title } from "native-base";
import { newVenue, removeVenue } from '../actions/actions'
import { connect } from 'react-redux'

class DeviceList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false
    }
  }


  _addNewVenue = connectionSettings => {
    this.props.newVenue( connectionSettings)  ;
  };

  _onPressItem = connectionSettings => {
    const device = connectDevice(connectionSettings);
    this.props.navigation.push("Device", { device });
  };

  _removeDevice = ( uuid ) => {
    this.props.removeVenue( uuid )
  };

  _toggleEdit = () => {
    console.log("this.state.editing :", this.state.editing);
    this.setState({ editing: !this.state.editing });
  };

  _renderItem = ({ item }) => (
    <DeviceListItem
      device={item}
      onPressItem={this._onPressItem}
      removeDevice={this._removeDevice}
      editing={this.state.editing}
    />
  );

  _storeData = async () => {
    try {
      await AsyncStorage.setItem(
        "@PocketVenue:devices",
        JSON.stringify(this.props.venues)
      );
    } catch (error) {
      Alert.alert("Data Store Error", `${error.name}: ${error.message}`, [
        { text: "OK" }
      ]);
    }
  };

  _readData = async () => {
    try {
      // const venues = await AsyncStorage.getItem("@PocketVenue:devices");
      // this.setState({ venues: JSON.parse(venues) });
    } catch (error) {
      Alert.alert("Data Store Error", `${error.name}: ${error.message}`, [
        { text: "OK" }
      ]);
    }
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <NewDevice addNewVenue={data => this._addNewVenue(data)} />
          </Left>
          <Body>
            <Title>Device List</Title>
          </Body>
          <Right>
            <Icon
              name="remove-circle-outline"
              onPress={() => this._toggleEdit()}
              style={this.state.editing ? { color: "red" } : { color: "blue" }}
            />
          </Right>
        </Header>
        <Content>
          <FlatList
            data={this.props.venues}
            editing={this.state.editing}
            renderItem={this._renderItem}
          />
        </Content>
      </Container>
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
const mapStateToProps = (state, props) => {
  return {
    ...props,
    venues: state.venues
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    newVenue: (connectionSettings) => dispatch(newVenue(connectionSettings)),
    removeVenue: (uuid) => dispatch(removeVenue(uuid))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DeviceList)