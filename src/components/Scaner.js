import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import styles from '../stylesheets/appStyles'
export default class Scaner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scanData: []
        }
        this.device = this.props.navigation.getParam('device')
    }
    onStartPress = ()=>{
        this.device.stop()
        this.device.startScan([{index:0}])
    }
    onStopPress = ()=>{
        this.device.stopScan([{index:0}])
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
