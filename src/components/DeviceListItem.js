import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import styles from "../stylesheets/appStyles";

const DeviceListItem = props => {
  const { device } = props;
  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity onPress={() => props.onPressItem(device)}>
        <Text style={styles.listItem}>{`${device.name} @ ${device.address} : ${
          device.port
        }`}</Text>
      </TouchableOpacity>
      <Icon
        type="Feather"
        name="trash-2"
        onPress={() => props.removeDevice(device.key)}
      />
    </View>
  );
};

export default DeviceListItem;
