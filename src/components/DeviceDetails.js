import React from 'react'
import uuid from 'uuid/v1'
import { View, Text, Button, FlatList} from 'react-native'
import DetailListItem from './DetailListItem'
import styles from '../stylesheets/appStyles'

const DeviceDetails = ({navigation}) => {
    const {device} = navigation.state.params

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <Text>{`${device.name} @ ${device.address}: ${device.type}`}</Text>
                <FlatList
                data={device.fetchData()}
                keyExtractor={()=>uuid()}
                renderItem={({item})=>(
                    <DetailListItem item={item} />
                )} />
            </View>
            <View style={[styles.toolbar, {alignContent:'flex-end'}]}>
                <Button title={"Scan"} />
                <Button title={"Device Settings"} />
            </View>
        </View>
    )
}



export default DeviceDetails
