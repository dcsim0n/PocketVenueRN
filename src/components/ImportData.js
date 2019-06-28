/**
|--------------------------------------------------
| OpenURL component, handles openning and parsing
| FFX xml type files
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import {ParseFFX} from '../lib/libFFX'
import alertError from './alertError'






const ImportData = (props) => {

    const url = props.navigation.getParam("url")
    const [txList, setTxList] = useState(null)
    
    useEffect(( ) => {
        if(txList === null){
            ParseFFX(url)
            .then(ffx => setTxList(ffx.TX))
        }
        
    })

    console.log(url)
    return (
        <View>
            <Text>Lets open some data:</Text>
            {txList && txList.map(( tx ) => <Text key={tx.uuid}>{ tx.name +  " " + tx.channel.freq}</Text>)}
        </View>
    )
}

export default ImportData
