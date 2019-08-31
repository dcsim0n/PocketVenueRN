import React, { Component } from 'react'
import { Text, View, Button, ScrollView } from 'react-native'
import { withDevice } from '../lib/withDevice';
import BlurListener from './BlurListener'
import RfGraph from './RfGraph'
import styles from '../stylesheets/appStyles'
import uuid from 'uuid/v1';


class Scaner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scanData: [],
            scanInterval: 1000
        }
        this.device = this.props.device
        
    }
    handleUpdate = (data)=>{
        console.log("calback called, todo: update state with data")
        this.setState({scanData:data})
        console.log('data', data)
    }
    onStartPress = ()=>{
        this.device.startScan(this.state.scanInterval,this.handleUpdate)
    }
    onStopPress = ()=>{
        this.device.stopScan()
    }
    filterTxByBlock(block){
        return this.device.deviceData.filter(( device ) => device.block === block)
    }
    render() {
        return (
            <BlurListener {...this.props} startOnFocus={false} >
                <View style={styles.container}>
                    <ScrollView >
                        { this.state.scanData.map( (scan) => <RfGraph scan={scan} tx={this.filterTxByBlock(scan.block)} key={uuid()} /> ) }
                        <View style={styles.toolbar} >
                            <Button title={"Start Scan"} onPress={this.onStartPress} />
                            <Button title={"Stop Scan"} onPress={this.onStopPress} />
                        </View>
                    </ScrollView>
                </View>
            </BlurListener>
        )
    }

}
export default withDevice(Scaner)
