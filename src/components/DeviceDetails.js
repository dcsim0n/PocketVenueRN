import React, {Component} from 'react'
import uuid from 'uuid/v1'
import { View, Text, Button, FlatList, Alert} from 'react-native'
import {withNavigationFocus} from 'react-navigation';
import DetailListItem from './DetailListItem'
import styles from '../stylesheets/appStyles'

const refreshRate = 2000

class DeviceDetails extends Component {
    constructor(props) {

        super(props)
        this.device = this.props.navigation.getParam('device')
        this.blurListener = this.props.navigation.addListener('willBlur',this.componentWillBlur)
        this.focusListener = this.props.navigation.addListener('didFocus',this.componentWillFocus)
        this.state = {
             deviceData: []
        }

    }

    componentDidMount() {
        this.device.start(refreshRate,this.handleData,this.handleError)
    }
    componentWillUnmount(){
        console.log("Stoping connection")
        this.device.stop()
        this.blurListener.remove()
    }
    componentWillBlur = ()=>{
        console.log("Blurring")
        this.device.stop()
    }
    componentWillFocus =()=>{
        console.log("Focusing")
        this.device.start(refreshRate,this.handleData,this.handleError)
    }
    handleData = (data) =>{
        console.log("Recieved new data...",data)
        this.setState({deviceData:data})
    }
    handleError = (error)=>{
        this.device.stop()
        Alert.alert(
            "Device Error",
            `${error.name}: ${error.message}`,
            [{text:'OK'}]
        )
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
                    <Button title={"Scan"} onPress={()=>this.props.navigation.push("Scan",{device:this.device})}/>
                    <Button title={"Device Settings"} />
                </View>
            </View>
        )
    }
}

export default withNavigationFocus(DeviceDetails)