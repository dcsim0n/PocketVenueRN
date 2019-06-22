/**
|--------------------------------------------------
| OpenURL component, handles openning and parsing
| FFX xml type files
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { useState } from 'react'
import { View, Text, Alert } from 'react-native'

const ENCODING = 'utf8' //TODO: abstract this and other constants into constants file

const FileSystem = require('react-native-fs')

const xml2js = require('xml2js')

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
    const [xmlData, setXmlData] = useState("")

    try {
        openFile(url)
        .then(( xmlResult ) => {
            setXmlData(xmlResult)
        })
    } catch (error) {
        Alert.alert(
            "Error",
            error.name + ": " + error.message,
            [{ text: "OK"}])
    }
    return (
        <View>
            <Text>Lets open some data:</Text>
            <Text>{ url } </Text>
            <Text>{ xmlData }</Text>
        </View>
    )
}

export default OpenURL
