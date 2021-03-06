/**
|--------------------------------------------------
| Redux Actions for Pocket Venue
| 2019 Dana Simmons
|--------------------------------------------------
*/
import C from '../constants';
import uuid from 'uuid/v1';


export function newVenue( connectionSettings ) {
  connectionSettings.key = uuid(); //Generate unique key
  return { type: C.NEW_VENUE, payload: connectionSettings };
}

export function removeVenue(uuid) {
  return { type: C.POP_VENUE, payload: uuid };
}

export function addSetting( preferences ) {
  return { type: C.ADD_SETTING, payload: preferences }
}

export function setActiveVenue( uuid ) {
  return { type: C.SET_ACTIVE_VENUE, payload: uuid }
}