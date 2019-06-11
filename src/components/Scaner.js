import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import styles from '../stylesheets/appStyles'
export default class Scaner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scanData: [],
            scanInterval: 1000
        }
        this.device = this.props.navigation.getParam('device')
    }
    handleUpdate = (data)=>{
        console.log("calback called, todo: update state with data")
        this.setState({scanData:data})
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
                {this.state.scanData.map(scan=><><Text>{scan.block}</Text><Text>Start:{scan.start}End:{scan.end}</Text><Text>{scan.scan.join(',')}</Text></>)}
                <View style={styles.toolbar} >
                    <Button title={"Start Scan"} onPress={this.onStartPress} />
                    <Button title={"Stop Scan"} onPress={this.onStopPress} />
                </View>
            </View>
        )
    }
}
