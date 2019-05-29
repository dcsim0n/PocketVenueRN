import React, { Component } from 'react'
import {View, Modal, Text, TouchableHighlight,Button} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import styles from './stylesheets/appStyles'

export default class NewVeneuDialog extends Component {
    constructor(props){
        super(props)
        this.state ={
            venue:{
                address: "127.0.0.1",
                port: "4080",
                name: "New Venue"
            },
            modalVisible: false
        }
        
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }
    setVeneuState(data){
        this.setState(({venue})=>{
            const venueData = Object.assign(venue,data)
            return {venue:venueData}
        })
    }
    render() {      
        const {name,port,address} = this.state.venue 
        return (
            <View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              
                <View style={styles.modal}>
                    <Text>Device Label</Text>
                    <TextInput 
                        style={styles.textInput}
                        onChangeText={(text)=>this.setVeneuState({name:text})}   
                        value={name}/> 

                    <Text>Venue Address</Text>
                    <TextInput 
                        style={styles.textInput}
                        onChangeText={(text)=>this.setVeneuState({name:text})} 
                        value={address}/>
                        
                    <Text>Venue Port</Text>
                    <TextInput 
                        style={styles.textInput}
                        onChangeText={(text)=>this.setVeneuState({name:text})} 
                        value={port}/>

                    <Button
                    title={"Add"}
                    onPress={() => {
                        this.props.addNewVenue(this.state.venue)
                        this.setModalVisible(!this.state.modalVisible);
                    }} />
                </View>
            </Modal>
    
            <Button
              title={"New Venue"}
              onPress={() => {
                this.setModalVisible(true);
              }} />
          </View>
        )
    }
}
