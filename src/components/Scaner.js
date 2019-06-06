import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import styles from '../stylesheets/appStyles'
export default class Scaner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scanData: [],
            scanInterval: 2000
        }
        this.device = this.props.navigation.getParam('device')
    }
    handleUpdate = ()=>{
        console.log("calback called, todo: update state with data")
    }
    onStartPress = ()=>{
        this.device.stop()
        this.device.startScan(this.state.scanInterval,this.handleUpdate)
    }
    onStopPress = ()=>{
        this.device.stopScan()
    }
    render() {
        return (
            <View>
                <Text> Chart goes here </Text>
                <View style={styles.toolbar} >
                    <Button title={"Start Scan"} onPress={this.onStartPress} />
                    <Button title={"Stop Scan"} onPress={this.onStopPress} />
                </View>
            </View>
        )
    }
}
