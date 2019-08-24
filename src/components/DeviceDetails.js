/**
|--------------------------------------------------
| Main Detail View Component for Connected Devices
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { Component } from "react";
import uuid from "uuid/v1";
import PropTypes from "prop-types";
import { View, Text, Button, FlatList } from "react-native";
import { withDevice } from "../lib/withDevice";
import DetailListItem from "./DetailListItem";
import styles from "../stylesheets/appStyles";
import  BlurListener  from './BlurListener';

class DeviceDetails extends Component {
  _onBlockPress = item => {
    const { device } = this.props;
    this.props.navigateWithDevice("Data", { item });
  };
  render() {
    return (
      <BlurListener {...this.props} >
        <View style={styles.container}>
          <View style={styles.container}>
            <Text>{`${this.props.device.name} @ ${this.props.device.address}: ${
              this.props.device.type
            }`}</Text>
            <FlatList
              contentContainerStyle={styles.celledList}
              numColumns={2}
              horizontal={false}
              data={this.props.deviceData}
              keyExtractor={() => uuid()}
              renderItem={({ item }) => (
                <DetailListItem 
                onBlockPress={this._onBlockPress} 
                item={item} 
                preferences={this.props.preferences} 
                />
              )}
            />
          </View>
          <View style={[styles.toolbar, { alignContent: "flex-end" }]}>
            <Button
              title={"Scan"}
              onPress={() => this.props.navigateWithDevice("Scan")}
            />
            <Button
              title={"Device Settings"}
              onPress={() => this.props.navigateWithDevice("DeviceSettings")}
            />
          </View>
        </View>
      </BlurListener>
    );
  }
}
DeviceDetails.propTypes = {
  deviceData: PropTypes.array,
  scanData: PropTypes.array,
  device: PropTypes.object
};
export default withDevice(DeviceDetails);
