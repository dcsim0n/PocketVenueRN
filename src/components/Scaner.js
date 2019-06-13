import React, { Component } from 'react'
import { Text, View, Button, ScrollView } from 'react-native'
import RfGraph from './RfGraph'
import styles from '../stylesheets/appStyles'
import uuid from 'uuid/v1';


export default class Scaner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scanData: [],
            scanInterval: 1000
        }
        this.device = this.props.navigation.getParam('device')
        this.onBlur = this.props.navigation.addListener('willBlur',this.componentWillBlur)
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
    render() {
        return (
            <View style={styles.container}>
                <ScrollView >
                    { this.state.scanData.map( (scan) => <RfGraph scan={scan} key={uuid()} /> ) }
                    <View style={styles.toolbar} >
                        <Button title={"Start Scan"} onPress={this.onStartPress} />
                        <Button title={"Stop Scan"} onPress={this.onStopPress} />
                    </View>
                </ScrollView>
            </View>
        )
    }
    componentWillBlur = () => {
        this.device.stop()
    }

    componentWillUnmount () {
        this.onBlur.remove()
    }
}
