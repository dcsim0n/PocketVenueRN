import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'
import styles from '../stylesheets/appStyles'
export default class Scaner extends Component {
    constructor(props) {
        super(props)

        this.device = this.props.navigation.getParam('device')
    }
    render() {
        return (
            <View>
                <Text> Chart goes here </Text>
                <View style={styles.toolbar} >
                    <Button title={"Start Scan"} />
                    <Button title={"Stop Scan"} />
                </View>
            </View>
        )
    }
}
