import {Alert} from 'react-native'

export default function alertError(error){
    Alert.alert(
        "Error",
        error.name + ": " + error.message,
        [{ text: "OK"}])
}