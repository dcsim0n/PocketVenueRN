import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../stylesheets/appStyles";

const DetailListItem = props => {

  return (
    <View
    style={styles.celledListItem}
    >
      <TouchableOpacity
        onPress={() => props.onBlockPress(props.item)}
      >
        <Text style={{fontSize: 16}}>
          <Text>CH {props.item.index} : {props.item.label || "No Label"}{'\n'}</Text>
          <Text>Blk: {props.item.block}</Text>
          <Text> Hex: {props.item.hex}{'\n'}</Text>
          <Text style={cellStyles.frequency}>{props.item.frequency.toFixed(2)}{'\n'}</Text>
          <Text>{props.item.voltage.toFixed(2)}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};
DetailListItem.propTypes = {
  item: PropTypes.shape({
    block: PropTypes.string,
    frequency: PropTypes.number.isRequired,
    pilot: PropTypes.string.isRequired,
    voltage: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
  })
};

const cellStyles = StyleSheet.create({
  frequency: {
    flex:1, 
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 500,
  },
})
export default DetailListItem;
