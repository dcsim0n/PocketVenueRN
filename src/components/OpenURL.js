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

const ENCODING = 'utf8' //TODO: abstract this and other constants into constants file

const FileSystem = require('react-native-fs')

const {parseString} = require('xml2js')

async function openFile(url){
    
    const fileStat = await FileSystem.stat(url)
   
    if(fileStat.isFile()){
        return FileSystem.readFile(fileStat.path,ENCODING)
    }else{
        console.log("Failed to open url:",url)
        throw new Error("File Error: url is not a valid file")
    }
}

const OpenURL = (props) => {

    const url = props.navigation.getParam("url")
    const [txList, setTxList] = useState(null)
    
    if( !txList ){
        openFile(url)
        .then(( xmlResult ) => {
            parseString(xmlResult,(err,result)=>{
                console.log('result', result)
                setTxList(result.FFX.TX)
            })
        },(error) => alertError(error))
    }


    console.log(txList)
    return (
        <View>
            <Text>Lets open some data:</Text>
            {txList && txList.map(( tx ) => <Text>{ tx['$'].name + tx.channel[0]['$'].freq}</Text>)}
        </View>
    )
}

export default OpenURL
