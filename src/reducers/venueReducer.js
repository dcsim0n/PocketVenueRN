/**
|--------------------------------------------------
| Redux Reducer for Venue data
| 2019 Dana Simmons 
|--------------------------------------------------
*/

import C from '../constants'

const initialState = []
export default function venueReducer( state = initialState, {type, payload} ){
    switch (type) {
      case C.NEW_VENUE:
        return [...state, payload] //This can be cleaned up with separate reducers

      case C.POP_VENUE:
        return state.filter((venue) => venue.key !== payload.key)
        
      default:
        return state;
    }
  }
  