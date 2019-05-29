import {StyleSheet} from 'react-native'
const lightGrey = '#EEE'
const grey = "#CCC"
const defaultTextSize = 22
export default styles = StyleSheet.create({
    toolbar: {
      fontSize: defaultTextSize,
      flexDirection: 'row'
    },
    listView:{
      flexDirection: 'column',
      backgroundColor: lightGrey,
      borderWidth: 1
    },
    listItem:{
      borderWidth: StyleSheet.hairlineWidth,
      fontSize: defaultTextSize
    },
    textInput:{
      fontSize: defaultTextSize,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: '#EEE'
    },
    modal:{
      fontSize: defaultTextSize,      
      flex: 1,
      margin: 22,
      marginTop: 22,
      justifyContent: 'center'
    }
  })