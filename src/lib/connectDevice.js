import VRWB from './libVRWB' 
import VRM2WB from './libVRM2WB'
import Dummy from './libDummy'
import DeviceTypes from './deviceTypes'
//Factory function for instantiating new device

export function connectDevice(options){
    const {type} = options
    switch (type) {
        case DeviceTypes.VRM2WB:
            return new VRM2WB(options)
        case DeviceTypes.VRWB:
            return new VRWB(options)
        case DeviceTypes.TEST:
            return new Dummy(options)
        default:
            return null
    }
}