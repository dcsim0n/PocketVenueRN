import React from 'react'
import { View, Text, Button } from 'react-native'
import styles from '../stylesheets/appStyles'

const DeviceDetails = ({navigation}) => {
    const {device} = navigation.state.params
    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Text>{`${device.name} @ ${device.address}`}</Text>

            </View>
            <View style={[styles.toolbar, {alignContent:'flex-end'}]}>
                <Button title={"Scan"} />
                <Button title={"Device Settings"} />
            </View>
        </View>
    )
}

export default DeviceDetails
