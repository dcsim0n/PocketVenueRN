import React, { Component } from 'react'
import {View, Modal, Text, TouchableHighlight,Button} from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import styles from './stylesheets/appStyles'

export default class NewVeneuDialog extends Component {
    constructor(props){
        super(props)
        this.state ={
            address: "127.0.0.1",
            port: 4080,
            name: "New Venue",
            modalVisible: false
        }
        
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }
    render() {       
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
                    <TextInput style={styles.textInput} />
                    <Text>Venue Address</Text>
                    <TextInput style={styles.textInput} />
                    <Text>Venue Port</Text>
                    <TextInput style={styles.textInput} />
                    <Button
                    title={"Add"}
                    onPress={() => {
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
