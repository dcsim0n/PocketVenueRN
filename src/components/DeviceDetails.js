import React, {Component} from 'react'
import uuid from 'uuid/v1'
import { View, Text, Button, FlatList} from 'react-native'
import DetailListItem from './DetailListItem'
import styles from '../stylesheets/appStyles'

export default class DeviceDetails extends Component {
    constructor(props) {

        super(props)
        this.device = this.props.navigation.getParam('device',)
        this.state = {
             deviceData: []
        }
    }
    _updateDeviceData(data){
        console.log("updating device data:",data)
    }
    componentDidMount() {
        this.device.start(1000,this.handleData)
    }
    handleData = (data) =>{
        console.log("Recieved new data...",data)
    }
    componentWillUnmount(){
        console.log("Stoping connection")
        this.device.stop()
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text>{`${this.device.name} @ ${this.device.address}: ${this.device.type}`}</Text>
                    <FlatList
                    data={this.state.deviceData}
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