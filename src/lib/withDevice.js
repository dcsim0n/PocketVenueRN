import React, { Component } from 'react'
import {Alert} from 'react-native'
import PropTypes from 'prop-types'



export function withDevice(ComponentToWrap){

    class Wrapper extends Component {
        constructor(props) {
            super(props)
            this.navigation = this.props.navigation
            this.device = this.navigation.getParam('device')
            this.blurListener = this.navigation.addListener('willBlur',this.componentWillBlur)
            this.focusListener = this.navigation.addListener('didFocus',this.componentDidFocus)
            this.state = {
                 deviceData: [],
                 scanData: [],
                 refreshRate: 2000
            }
        }
        handleDeviceData = ()=>{
            this.setState({deviceData: this.device.deviceData})
        }
        handleScanData = ()=>{
            this.setState({scanData: this.device.scanData})
        }
        handleError = (error)=>{
            this.device.stop()
            Alert.alert(
                "Device Error",
                `${error.name}: ${error.message}`,
                [{text:'OK'}]
            )
        }
        componentDidFocus = ()=>{
            console.log('focusing')
            this.device.start(
                this.state.refreshRate,
                this.handleDeviceData,
                this.handleError)
        }
        componentWillBlur = ()=>{
            console.log('blurring..')
            this.device.stop()
        }
        componentWillUnmount(){
            this.blurListener.remove()
            this.focusListener.remove()
        }
        render() {
            return (
                <ComponentToWrap
                deviceData={this.state.deviceData} 
                scanData={this.state.scanData}
                device={this.device} 
                {...this.props}/>
            )
        }
    }
    Wrapper.propTypes = {
        navigation: PropTypes.object.isRequired
    }
    
    return Wrapper
}
    