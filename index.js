/**
 * @format
 */
/**
|--------------------------------------------------
| Pocket Venue App Navigator Component
| 2019 Dana Simmons
|--------------------------------------------------
*/
import React from 'react'
import { AppRegistry } from 'react-native';
import { createStackNavigator, createAppContainer} from 'react-navigation'
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import DeviceList from './src/components/DeviceList';
import DeviceDetails from './src/components/DeviceDetails'
import DataDetails from './src/components/DataDetails'
import Scanner from './src/components/Scaner'
import ImportData from './src/components/ImportData'
import DeviceSettings from './src/components/DeviceSettings';
import { saveData, readData} from './datastorage'
import rootReducer from './src/reducers/rootReducer'
import {name as appName} from './app.json';

const AppNavigator = createStackNavigator({
    Main: {
      screen : DeviceList
    },
    Device: {
      screen: DeviceDetails
    },
    Data: {
      screen: DataDetails
    },
    Scan: {
      screen: Scanner
    },
    ImportData:{
      screen: ImportData 
    },
    DeviceSettings: {
      screen: DeviceSettings
    }
  })
const AppContainer = createAppContainer(AppNavigator)

const store = createStore(rootReducer);

const App = ( ) => {
  return (
    <Provider store={store} >
      <AppContainer />
    </Provider>
  )
}

store.subscribe(()=>{
  console.log('state', store.getState())
  saveData(store.getState())
})
AppRegistry.registerComponent(appName, ()=> App );
