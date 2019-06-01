import VRWB from './libVRWB' 
import VRM2WB from './libVRM2WB'
import DeviceTypes from './deviceTypes'
//Factory function for instantiating new device

export function connectDevice(options){
    const {type} = options
    switch (type) {
        case DeviceTypes.VRM2WB:
            return new VRM2WB(options)
        case DeviceTypes.VRWB:
            return new VRWB(options)
        default:
            return null
    }
}