import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import styles from "../stylesheets/appStyles";
import alertError from "./alertError";

function  bbgColor(item,preferences){ //Battery background color
  //Pull the warn/alert settings out of the preference hash
  // item represents the channel data of a receiver
  
  const itemBatteryPreference = preferences[item.batteryType] 
  
  let bgcolor = "transparent";
  try{
    if ( item.voltage <= itemBatteryPreference.warn ){
      bgcolor = "yellow";
    }
    if ( item.voltage <= itemBatteryPreference.alert ){
      bgcolor = "red";
    }
  }catch(err){
    alertError(new Error(`Problem calculating battery warnings: ${err.message}`))
  }
  return bgcolor; 
}
const DetailListItem = props => {
  const { item, preferences } = props
  return (
    <View
      style={styles.celledListItem}
    >
      <TouchableOpacity
        onPress={() => props.onBlockPress(item)}
      >
        <Text style={{fontSize: 16}}>
          <Text>CH {item.index} : {item.label || "No Label"}{'\n'}</Text>
          <Text>Blk: {item.block}</Text>
          <Text> Hex: {item.hex}{'\n'}</Text>
          <Text 
           style={cellStyles.frequency}
          >
            {item.frequency.toFixed(2)}{'\n'}
          </Text>
          <Text 
           style={{ backgroundColor: bbgColor(item,preferences) }}
          >
            {item.voltage.toFixed(2)}
          </Text>
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
    index: PropTypes.number.isRequired,
    batteryType: PropTypes.string.isRequired
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
