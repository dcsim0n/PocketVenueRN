import React from 'react'
import { View, Text } from 'react-native'

const DetailListItem = (props) => {
    return (
        <View>
            <Text>{props.item.block}</Text>
            <Text>{props.item.frequency}</Text>
            <Text>{props.item.voltage}</Text>
        </View>
    )
}

export default DetailListItem
