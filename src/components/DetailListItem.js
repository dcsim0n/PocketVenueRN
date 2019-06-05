import React from 'react'
import { View, Text, TouchableOpacity} from 'react-native'
import styles from '../stylesheets/appStyles';

const DetailListItem = (props) => {
    return (
        <TouchableOpacity 
        onPress={()=>props.onBlockPress(props.item)}
        style={styles.celledListItem} >
                <Text>{props.item.block}</Text>
                <Text>{props.item.frequency}</Text>
                <Text>{props.item.voltage}</Text>
        </TouchableOpacity>
    )
}

export default DetailListItem
