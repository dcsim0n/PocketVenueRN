import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import { LineChart , Grid} from 'react-native-svg-charts'
import styles from '../stylesheets/appStyles'
export default class Scaner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scanData: [{scan:[0]}],
            scanInterval: 500
        }
        this.device = this.props.navigation.getParam('device')
    }
    handleUpdate = (data)=>{
        console.log("calback called, todo: update state with data")
        this.setState({scanData:data})
        console.log('data', data)
    }
    onStartPress = ()=>{
        this.device.stop()
        this.device.startScan(this.state.scanInterval,this.handleUpdate)
    }
    onStopPress = ()=>{
        this.device.stopScan()
    }
    dataHelper = ()=>{
        return this.state.scanData[0].scan
    }
    render() {
        console.log("Rendering with data",this.dataHelper())
        return (
            <View>
                <LineChart
                    style={{ height:200 }}
                    data={ this.dataHelper() }
                    svg={{ stroke: 'rgb(134,65,244)' }}
                    contentInset={{ top:20, bottom: 20}}>
                        <Grid />
                </LineChart>

                <View style={styles.toolbar} >
                    <Button title={"Start Scan"} onPress={this.onStartPress} />
                    <Button title={"Stop Scan"} onPress={this.onStopPress} />
                </View>
            </View>
        )
    }
}
