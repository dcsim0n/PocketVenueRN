import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TouchableOpacity} from 'react-native'
import styles from '../stylesheets/appStyles';

const DetailListItem = (props) => {
    return (
        <TouchableOpacity 
        onPress={()=>props.onBlockPress(props.item)}
        style={styles.celledListItem} >
                <Text>{props.item.label || "No Label"}</Text>
                <Text>{props.item.block}</Text>
                <Text>{props.item.frequency}</Text>
                <Text>{props.item.voltage}</Text>
        </TouchableOpacity>
    )
}
DetailListItem.propTypes = {
    item : PropTypes.shape({
        frequency: PropTypes.number.isRequired,
        pilot: PropTypes.string.isRequired,
        voltage: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired
    })
}
export default DetailListItem
