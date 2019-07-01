import React, { useState, useEffect } from "react";
import { Text, Animated } from "react-native";
import { Icon, ListItem, Body, Right, Button } from "native-base";

const DeviceListItem = props => {
  const { device } = props;
  const [opacity, setOpacity] = useState(new Animated.Value(0))
  useEffect(() => {
    if(props.editing){
        Animated.timing(opacity,{
            duration: 300,
            toValue: 1
        }).start();
    }
    else{
        Animated.timing(opacity,{
            duration: 300,
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
          <Button style={{ backgroundColor: "red" }} onPress={() => props.removeDevice(device.key)}>
            <Icon
            type="Feather"
            name="trash-2"
            style={{ color: "white" }}
            />
          </Button>
        </Animated.View>
      </Right>
    </ListItem>
  );
};

export default DeviceListItem;
