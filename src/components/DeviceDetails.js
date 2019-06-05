import React, {Component} from 'react'
import uuid from 'uuid/v1'
import { View, Text, Button, FlatList, StyleSheet} from 'react-native'
import DetailListItem from './DetailListItem'
import styles from '../stylesheets/appStyles'

export default class DeviceDetails extends Component {
    constructor(props) {

        super(props)
        this.device = this.props.navigation.getParam('device')
        this.state = {
             deviceData: []
        }
    }

    componentDidMount() {
        this.device.start(2000,this.handleData)
    }
    handleData = (data) =>{
        console.log("Recieved new data...",data)
        const expectedKeys = ['index', 'frequency','voltage','pilot']
        expectedKeys.forEach((key)=> {
            if(!(key in data)){
                throw new Error(`Missing '${key}' in data object`)
            }
        })
        this.setState({deviceData:data})
    }
    componentWillUnmount(){
        console.log("Stoping connection")
        this.device.stop()
    }
    _onBlockPress = (item)=>{
        this.props.navigation.push("Data",{item})
    }
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.container}>
                    <Text>{`${this.device.name} @ ${this.device.address}: ${this.device.type}`}</Text>
                    <FlatList
                    contentContainerStyle={styles.celledList}
                    numColumns={2}
                    horizontal={false}
                    data={this.state.deviceData}
                    keyExtractor={()=>uuid()}
                    renderItem={({item})=>(
                        <DetailListItem onBlockPress={this._onBlockPress} item={item} />
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

