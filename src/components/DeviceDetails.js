import React, {Component} from 'react'
import uuid from 'uuid/v1'
import { View, Text, Button, FlatList} from 'react-native'
import DetailListItem from './DetailListItem'
import styles from '../stylesheets/appStyles'
import console = require('console');

export default class DeviceDetails {
    constructor(props) {
        super(props)
        this.device = props.device
        this.interval = null
        this.state = {
             deviceData: []
        }
    }
    _updateDeviceData(data){
        console.log("updating device data:",data)
    }
    componentDidMount() {
        //Fetch data
        this.interval = setInterval()
    }
    render(){
        return(
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
}