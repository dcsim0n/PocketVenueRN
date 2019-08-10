/**
|--------------------------------------------------
| Persistant Store: stores devices in AsyncStorage
| 2019 Dana Simmons
|--------------------------------------------------
*/

import AsyncStorage from '@react-native-community/async-storage'
import { createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import rootReducer  from './src/reducers/rootReducer'

// storage key: @PocketVenue:state

// export store
// https://github.com/rt2zz/redux-persist
const persistConfig = {
  key: "devices",
  storage: AsyncStorage
}

const persistedReducer = persistReducer( persistConfig, rootReducer )


export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
