import React, { useState } from "react";
import PropTypes from "prop-types";
import { View, Text, Picker, TextInput, Button } from "react-native";
import Slider from "@react-native-community/slider";
import styles from "../stylesheets/appStyles";

const blocks = require("../lib/blocks.json");

const DataDetails = ( props ) => {

  const item = props.navigation.getParam("item");
  const [frequency, changeFrequency] = useState(item.frequency);
  const [batteryType, changeBattery] = useState(item.batteryType);
  const [level, changeLevel] = useState(item.level);

  const device = props.navigation.getParam("device");
  const { BatteryTypes } = device

  const freqs = [];
  for (let freq = blocks[item.block].start; freq <= blocks[item.block].end; freq += 0.1) {
    freqs.push(parseFloat(freq.toFixed(2))); //Avoid javascript floating point addition errors
  }

  return (
    <View style={ styles.container }>
      <Text style={ styles.baseText }>Ch: { item.index }, Label: </Text>
      <TextInput
        value={ item.label }
        style={[styles.textInput, { textAlign: "center" }]}
        onChangeText={( text ) => console.log(text) }
      />
      <Text style={styles.baseText}>Block: {item.block}</Text>
      <Text style={styles.baseText}>Voltage: {item.voltage} V</Text>

      <View style={{ flex: 1, flexDirection: "row" }}>
        <Picker // Frequency picker component
          selectedValue={frequency}
          style={{ height: 50, flex: 1 }}
          onValueChange={( newFreq ) => changeFrequency(newFreq)}
        >
          {freqs.map(freq => (
            <Picker.Item
              key={ freq }
              label={ freq.toFixed(2) + " MHz"}
              value={ freq }
            />
          ))}
        </Picker>

        <Picker //Battery type picker component
          selectedValue={batteryType}
          style={{ height: 50, flex: 1 }}
          onValueChange={(value) => changeBattery(value)}
        >
          {Object.keys(BatteryTypes).map(key => (
            <Picker.Item key={key} label={BatteryTypes[key]} value={key} />
          ))}
        </Picker>
      </View>

      <View style={styles.container}>
        <Text>Channel Output Level: {level} </Text>
        <Slider //Channel output level slider
          width={200}
          minimumValue={-15}
          maximumValue={8}
          value={level}
          step={1}
          onSlidingComplete={(value) => changeLevel(value)}
        />
        <Button
          title="Apply Changes"
          onPress={() => device.setChannelSettings({index: item.index, level, frequency, batteryType})}
        />
      </View>
    </View>
  );
};

DataDetails.propTypes = {
  item: PropTypes.shape({
    frequency: PropTypes.number.isRequired,
    block: PropTypes.string.isRequired,
    voltage: PropTypes.number.isRequired,
    batteryType: PropTypes.number.isRequired,
    outLevel: PropTypes.number.isRequired
  })
};

export default DataDetails;
