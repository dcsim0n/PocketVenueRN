import React from 'react'
import { View, Text } from 'react-native'

const DetailListItem = (props) => {
    return (
        <View>
            <Text>{props.item.description}</Text>
        </View>
    )
}

export default DetailListItem
