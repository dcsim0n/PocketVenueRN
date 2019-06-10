/**
|--------------------------------------------------
| Interface for Venue Wide Band devices
| 2019 Dana Simmons
|--------------------------------------------------
*/
import Device from './libDevice'

const blocks = require('./blocks.json')
const eventTypes = {
    BLOCKS: 'BLOCKS',
    FREQUENCIES: 'FREQUENCIES',
    BATTERY_VOLTAGE: 'BATTERY_VOLTAGE',
    BATTERY_TYPE: 'BATTERY_TYPE',
    PILOT_TONE: 'PILOT_TONE',
    RF_LEVEL: 'RF_LEVEL',
    ID: 'ID',

}
class VrwbReciever {
    constructor({index,block}){
        this.index = index
        this.block = block
        this.scanData = []
    }
    get blockBoundary(){
        return blocks[this.block]
    }
    startScan(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("todo: start scan proccess")
            },1000)
        })
    }
    pollScan(){
        console.log("todo: poll data")
    }
    stopScan(){
        console.log("todo: stop scanning")
    }
    //Other methods
}

export default class VRWB extends Device {
    constructor(options){
        super(options) 
        this.commands = {
            deviceId: {type: eventTypes.ID, cmd:'id ?\r'},        //Device type
            blocks:   {type: eventTypes.BLOCKS, cmd:'block(*) ?\r'},    //Reciever blocks
            battVolt: {type: eventTypes.BATTERY_VOLTAGE, cmd:'bvolts(*) ?\r'}, //Battery voltage
            battType: {type: eventTypes.BATTERY_TYPE, cmd: 'txbatt(*) ?\r'}, //Battery type as set in the device
            pilot:    {type:eventTypes.PILOT_TONE, cmd:'signal(*) ?\r'},    //Pilot tone status
            rxmeter:  {type: eventTypes.RF_LEVEL, cmd:'rmeter(*) ?\r'},  //Signal strength
            freqs:    {type: eventTypes.FREQUENCIES, cmd: 'mhz(*) ?\r'},       //Frequenies of the recievers
            startScan: 'rxscan(*) = 1\r',
            stopScan: 'rxscan(*) = 0\r',
            polScan: 'polsd(*) ?\r'
        }
        this._fetchData = this._fetchData.bind(this)
    }
    
    _startScan(){
        console.log(this.vrScanQue)

    }
    _stopScan(){
        const devicesToStop = this._getDevicesToScan()
        this._sendAsync(this.commands.stopScan,devicesToStop)

    }
    _pollScanData(){
        //Iterate over list of devices that are scanning
        //Send commands to retrieve data from them
        //Organize data and update _scanData acordingly
        //Call event handler to let clients know data is updated

        const devicesToPoll = this._getDevicesToScan()
        this._sendRecursively(this.commands.polScan,devicesToPoll)
        
    } 
    _getDevicesToScan(){
        //Iterate over known devices
        //Calculate which devices are unique and set a 'scan' flag
        //Return array of references to the devices

        if(this._deviceData.length === 0 ){throw new Error('Scan Error: device must be connected first')}
        return this._deviceData.filter((item,index)=>{ //Compares each item's block value and filters diplicates
            return this.deviceData.findIndex((item2)=>item2.block === item.block) === index
        })

    }
    _fetchData(){
        this.sendCmd(this.commands.blocks)
        this.sendCmd(this.commands.freqs)
        this.sendCmd(this.commands.battVolt)
        this.sendCmd(this.commands.pilot)
    }
    _jobSuccessHandler(result,job){
        switch (result.type) {
            case eventTypes.BLOCKS:
                this._deviceData = Object.assign(this._deviceData,{blocks: this._parseData(result.payload)})
                break;
            case eventTypes.FREQUENCIES:
                this._deviceData = Object.assign(this._deviceData,{frequencies: this._parseData(result.payload)})
                break;
            case eventTypes.BATTERY_VOLTAGE:
                this._deviceData = Object.assign(this._deviceData,{voltages: this._parseData(result.payload)})
                break;
            case eventTypes.PILOT_TONE:
                this._deviceData = Object.assign(this._deviceData,{pilotTones: this._parseData(result.payload)})
                this.dataHandler()
                break;
            default:
                console.log(`Unknown message type: ${result}`)
                break;
        }
        console.log(this._deviceData)
    }
    _jobErrorHandler(error){
        this._msgQueue.end()
        this.stop()
        console.log(error);
        throw new Error(error)
    }
}