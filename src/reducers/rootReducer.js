/**
|--------------------------------------------------
| Redux Action Reducers for PocketVenue
| 2019 Dana Simmons
|--------------------------------------------------
*/
import { combineReducers } from 'redux'
import venueReducer from './venueReducer'
import globalReducer from './globalReducer'

export default combineReducers({
  venues: venueReducer,
  globals: globalReducer
})
