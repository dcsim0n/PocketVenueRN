/**
|--------------------------------------------------
| OpenURL component, handles openning and parsing
| FFX xml type files
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import alertError from './alertError'






const ImportData = (props) => {

    const url = props.navigation.getParam("url")
    const [txList, setTxList] = useState(null)
    


    console.log(url)
    return (
        <View>
            <Text>Lets open some data:</Text>
            {txList && txList.map(( tx ) => <Text>{ tx['$'].name + tx.channel[0]['$'].freq}</Text>)}
        </View>
    )
}

export default ImportData
