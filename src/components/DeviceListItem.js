import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from '../stylesheets/appStyles'

const DeviceListItem = (props) => {
    const {device} = props
    return (
        <TouchableOpacity onPress={()=>props.onPressItem(device)}>
            
            <Text style={styles.listItem}>{`${device.name} @ ${device.address} : ${device.port}`}</Text>
            
        </TouchableOpacity>
    )
}

export default DeviceListItem
