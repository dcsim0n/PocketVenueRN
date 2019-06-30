import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, Animated } from "react-native";
import { Icon, ListItem, Body, Right } from "native-base";
import styles from "../stylesheets/appStyles";

const DeviceListItem = props => {
  const { device } = props;
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  useEffect(() => {
    if(props.editing && opacity === 0){
        Animated.timing(opacity,{
            duration: 1000,
            toValue: 1
        }).start();
        
    }else{
        Animated.timing(opacity,{
            duration: 1000,
            toValue: 0
        }).start() 
    }
  }, [props.editing])
  return (
    <ListItem icon button onPress={() => props.onPressItem(device)}>
      <Body>
        <Text>{`${device.name} @ ${device.address} : ${device.port}`}</Text>
      </Body>
      <Right>
        <Animated.View style={{ opacity: opacity}}>
            <Icon
            type="Feather"
            name="trash-2"
            onPress={() => props.removeDevice(device.key)}
            style={{ color: 'red' }}
            />
        </Animated.View>
      </Right>
    </ListItem>
  );
};

export default DeviceListItem;
