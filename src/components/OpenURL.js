import React from 'react'
import { View, Text } from 'react-native'

const OpenURL = (props) => {
    const url = props.navigation.getParam("url")
    return (
        <View>
            <Text>Lets open some data:</Text>
            <Text>{ url }</Text>
        </View>
    )
}

export default OpenURL
