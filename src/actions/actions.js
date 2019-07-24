/**
|--------------------------------------------------
| Redux Actions for Pocket Venue
| 2019 Dana Simmons
|--------------------------------------------------
*/
import C from '../constants';

export function newVenue(settings) {
  return { type: C.NEW_VENUE, payload: settings };
}

export function popVenue(uuid) {
  return { type: C.POP_VENUE, payload: uuid };
}

export function applySetting(setting) {
  return { type: C.APPLY_SETTING, payload: setting }
}