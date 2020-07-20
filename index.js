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
import { store, persistor } from './store'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import DeviceList from './src/components/DeviceList';
import RxDataGridView from './src/components/RxDataGridView'
import DataDetails from './src/components/DataDetails'
import Scanner from './src/components/Scaner'
import ImportData from './src/components/ImportData'
import DeviceSettings from './src/components/DeviceSettings';
import {name as appName} from './app.json';

const AppNavigator = createStackNavigator({
    Main: {
      screen : DeviceList
    },
    Device: {
      screen: RxDataGridView
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


const App = ( ) => {
  return (
    <PersistGate persistor={ persistor } >
      <Provider store={store} >
        <AppContainer />
      </Provider>
    </ PersistGate> 
  )
}

store.subscribe(()=>{
  console.log('state', store.getState())
})
AppRegistry.registerComponent(appName, ()=> App );
