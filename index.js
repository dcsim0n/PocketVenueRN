/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'
import DeviceList from './src/components/DeviceList';
import DeviceDetails from './src/components/DeviceDetails'
import DataDetails from './src/components/DataDetails'
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
    }
  })
const App = createAppContainer(AppNavigator)

AppRegistry.registerComponent(appName, () => App);
