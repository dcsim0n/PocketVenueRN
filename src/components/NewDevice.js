import React, { Component } from "react";
import { View, Modal, Text, Picker } from "react-native";
import { Button } from 'native-base'
import { TextInput } from "react-native-gesture-handler";
import styles from "../stylesheets/appStyles";
import DeviceTypes from "../lib/deviceTypes";
import { Icon } from "native-base";
export default class NewDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venue: {
        address: "127.0.0.1",
        port: "4080",
        name: "New Venue",
        type: "VRWB"
      },
      modalVisible: false
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  setVeneuState(data) {
    this.setState(
      ({ venue }) => {
        const venueData = Object.assign(venue, data);
        return { venue: venueData };
      });
  }
  render() {
    const { name, port, address } = this.state.venue;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.modal}>
            <Text>Device Label</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setVeneuState({ name: text })}
              value={name}
            />

            <Text>Device Address</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setVeneuState({ address: text })}
              value={address}
            />

            <Text>Device Port</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={text => this.setVeneuState({ port: text })}
              value={port}
            />

            <Text>Device Type</Text>
            <Picker
              style={{ flex: 1 }}
              selectedValue={this.state.venue.type}
              onValueChange={value => this.setVeneuState({ type: value })}
            >
              {Object.keys(DeviceTypes).map( key => (
                <Picker.Item key={ key } value={ key } label={ DeviceTypes[ key ].name } />
              ))}
            </Picker>

            <Button
              title={"Add"}
              onPress={() => {
                const settings = Object.assign({},this.state.venue) //Make each venue unique
                this.props.addNewVenue( settings );
                this.setModalVisible(!this.state.modalVisible);
              }}
            />

            <Button
              title={"Cancel"}
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            />
          </View>
        </Modal>

        { /* Add new device button */ }
        <Button transparent >
          <Icon 
            name="add-circle"
            onPress={() => this.setModalVisible(true)}
            style={{ color: "blue" }}
          />
        </Button>
      </View>
    );
  }
}
