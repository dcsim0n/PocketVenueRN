import VRM2WB from './libVRM2WB';
import Dummy from './libDummy';
import VRWB from './libVRWB';
import M2T from './libM2T'

function buildBatterySettings( batteryTypes ){
    const settings = Object.keys(batteryTypes).map(( key, i ) => {
        // create a 'Warn' and a 'Alert' setting for each type of battery
        return { preferenceKey: `${batteryTypes[key]}`,  alert: 0, warn: 0 , index: i }
    })
    return settings 
}
export default DeviceTypes = {
    VRM2WB: {
        name: 'Venue 2 / VRM2WB',
        initialize: ( options ) =>{
            const device = new VRM2WB( options )
            const preferences = buildBatterySettings(device.BatteryTypes)
            // preferences is an array object, 
            // not sure how I feel about adding a key to it
            // vvvvvvvv    
            preferences.key = options.key
            return { device, preferences }
        }
    },
    VRWB: {
        name: 'Venue WB / VRWB',
        initialize: ( options ) =>{
            const device = new VRWB( options )
            const preferences = buildBatterySettings(device.BatteryTypes)
            preferences.key = options.key
            return { device, preferences }
        }
    } ,
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
        initialize: ( options ) =>{
            const device = new Dummy( options )
            const preferences = buildBatterySettings(device.BatteryTypes)
            preferences.key = options.key
            return { device, preferences }
       }
    }
}