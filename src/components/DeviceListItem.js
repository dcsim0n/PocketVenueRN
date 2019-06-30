import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, Animated } from "react-native";
import { Icon, ListItem, Body, Right } from "native-base";
import styles from "../stylesheets/appStyles";

const DeviceListItem = props => {
  const { device } = props;
  const opacity = new Animated.Value(1);
  return (
    <ListItem icon button onPress={() => props.onPressItem(device)}>
      <Body>
        <Text>{`${device.name} @ ${device.address} : ${device.port}`}</Text>
      </Body>
      <Right>
        <Animated.View style={{ opacity: opacity }}>
          <Icon
            type="Feather"
            name="trash-2"
            onPress={() => props.removeDevice(device.key)}
            style={{ color: "red" }}
          />
        </Animated.View>
      </Right>
    </ListItem>
  );
};

export default DeviceListItem;
