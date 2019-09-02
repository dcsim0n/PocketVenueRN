import VRM2WB from "./libVRM2WB";
import Dummy from "./libDummy";
import VRWB from "./libVRWB";
import M2T from "./libM2T";

const DEFAULT_WARN = 0;
const DEFAULT_ALERT = 0;
function buildBatterySettings(batteryTypes) {
  const preferences = {};
  for (k in batteryTypes) {
    preferences[k] = { name: batteryTypes[k] , alert: DEFAULT_ALERT, warn: DEFAULT_WARN };
  }
  return preferences;
}

export default (DeviceTypes = {
  VRM2WB: {
    name: "Venue 2 / VRM2WB",
    initialize: options => {
      const device = new VRM2WB(options);
      let preferences = options.preferences;
      if (!preferences) { // If preferences is undefined, build them from scratch
        preferences = buildBatterySettings(device.BatteryTypes);
        preferences.key = options.key;
      }
      return { device, preferences };
    }
  },
  VRWB: {
    name: "Venue WB / VRWB",
    initialize: options => {
      const device = new VRWB(options);
      let preferences = options.preferences;
      if (!preferences) { // If preferences is undefined, build them from scratch
        preferences = buildBatterySettings(device.BatteryTypes);
        preferences.key = options.key;
      }
      return { device, preferences };
    }
  },
  // M2T: {
  //     name:  "M2 Duet",
  //     initialize: ( options ) =>{
  //         const device = new M2T( options )
  //         const settings = buildBatterySettings(device.BatteryTypes)
  //         return { device, settings }
  //     }
  // },
  // DSQD: {
  //     name: "D\xB2 Reciever",
  //     initialize: ( options ) =>{
  //         console.log("TODO: Build D2 support")
  //         throw Error("D2 Not implemented yet")
  //     }
  // },
  TEST: {
    name: "Demo Mode",
    initialize: options => {
      const device = new Dummy(options);
      let preferences = options.preferences;
      if (!preferences) { // If preferences is undefined, build them from scratch
        preferences = buildBatterySettings(device.BatteryTypes);
        preferences.key = options.key;
      }
      return { device, preferences };
    }
  }
});
