import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base';
import styles from '../stylesheets/appStyles'

const DeviceListItem = (props) => {
    const {device} = props
    return (
        <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>props.onPressItem(device)}>
                
                <Text style={styles.listItem}>{`${device.name} @ ${device.address} : ${device.port}`}</Text>
                
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> props.removeDevice(device.key)}>
                <Icon type="Feather" name="trash-2" />
            </TouchableOpacity>
            
        </View>
    )
}

export default DeviceListItem
