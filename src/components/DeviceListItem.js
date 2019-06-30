import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon, ListItem } from "native-base";
import styles from "../stylesheets/appStyles";

const DeviceListItem = props => {
  const { device } = props;
  return (
    <ListItem button onPress={() => props.onPressItem(device)}>
        <Text>{`${device.name} @ ${device.address} : ${
          device.port
        }`}</Text>
      <Icon
        type="Feather"
        name="trash-2"
        onPress={() => props.removeDevice(device.key)}
      />
    </ListItem>
  );
};

export default DeviceListItem;
