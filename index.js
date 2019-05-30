/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation'
import DeviceList from './src/components/DeviceList';
import {name as appName} from './app.json';

const AppNavigator = createStackNavigator({
    Main: {
      screen : DeviceList
    },
    // Details: {
    //     screen: DeviceDetails
    // }
  })
const App = createAppContainer(AppNavigator)

AppRegistry.registerComponent(appName, () => App);
