/**
|--------------------------------------------------
| Global Settings 
| 2019 Dana Simmons
|--------------------------------------------------
*/

import C from '../constants'

const initialState = []

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case C.APPLY_SETTING:
        return { ...state, ...payload }

    default:
        return state
    }
}
