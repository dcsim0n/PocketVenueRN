/**
|--------------------------------------------------
| Global Settings 
| 2019 Dana Simmons
|--------------------------------------------------
*/

import C from '../constants'

const initialState = {
    activeVenue: null
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case C.APPLY_SETTING:
        return { ...state, ...payload }
    case C.SET_ACTIVE_VENUE:
        return {
            ...state,
            activeVenue: payload
        }
    default:
        return state
    }
}
