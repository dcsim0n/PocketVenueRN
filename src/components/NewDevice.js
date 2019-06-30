import React, { Component } from "react";
import { View, Modal, Text, Picker, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styles from "../stylesheets/appStyles";
import devices from "../lib/deviceTypes";
import { Icon } from "native-base";
export default class NewDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      venue: {
        address: "127.0.0.1",
        port: "4080",
        name: "New Venue",
        type: devices.VRWB
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
              {Object.values(devices).map(value => (
                <Picker.Item key={value} value={value} label={value} />
              ))}
            </Picker>

            <Button
              title={"Add"}
              onPress={() => {
                this.props.addNewVenue(this.state.venue);
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
        <Icon 
          type="Feather"
          name="plus-circle"
          onPress={() => this.setModalVisible(true)}
          style={{ color: "blue" }}
        />
      </View>
    );
  }
}
