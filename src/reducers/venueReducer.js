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
      case C.NEW_VENUE: //Add new venue to state
        return [...state, payload] //This can be cleaned up with separate reducers

      case C.POP_VENUE:
        return state.filter((venue) => venue.key !== payload)
      
      case C.ADD_SETTING:
        const newState = state.map(( venue ) => {
          if( venue.key === payload.key ){
            venue.preferences = payload // This doesn't do any merging
          }
          return venue                             // Another map loop would let us merge 0(n^2)
        })
        return newState
        break;
      default:
        return state;
    }
  }
  