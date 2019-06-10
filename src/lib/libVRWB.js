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
    SCAN_START: "SCAN_START" ,
    SCAN_STOP: "SCAN_STOP" ,
    SCAN_POLL: "SCAN_POLL"

}

export default class VRWB extends Device {
    constructor(options){
        super(options) 
        this.commands = {
            deviceId: {type: eventTypes.ID, cmd:'id ?\r'},        //Device type
            blocks:   {type: eventTypes.BLOCKS, cmd:'block(*) ?\r'},    //Reciever blocks
            battVolt: {type: eventTypes.BATTERY_VOLTAGE, cmd:'bvolts(*) ?\r'}, //Battery voltage
            battType: {type: eventTypes.BATTERY_TYPE, cmd: 'txbatt(*) ?\r'}, //Battery type as set in the device
            pilot:    {type: eventTypes.PILOT_TONE, cmd:'signal(*) ?\r'},    //Pilot tone status
            rxmeter:  {type: eventTypes.RF_LEVEL, cmd:'rmeter(*) ?\r'},  //Signal strength
            freqs:    {type: eventTypes.FREQUENCIES, cmd: 'mhz(*) ?\r'},       //Frequenies of the recievers
            startScan:{type: eventTypes.SCAN_START, cmd: 'rxscan(*) = 1\r'} ,
            stopScan: {type: eventTypes.SCAN_STOP, cmd: 'rxscan(*) = 0\r'},
            polScan:  {type: eventTypes.SCAN_POLL, cmd: 'pollsd(*) ?\r'}
        }
        this._fetchData = this._fetchData.bind(this)
        this._fetchScanData = this._fetchScanData.bind(this)
    }
    
    _startScan(){
        //Initate scan process for uniqe Recievers
        const devices = this._getDevicesToScan()
        devices.forEach((device)=>{
            const cmdStr = this.commands.startScan.cmd.replace('*',device.index)
            const newCmd = {type: this.commands.startScan.type, cmd: cmdStr}
            this.sendCmd(newCmd)
        })

    }
    _stopScan(){
        const devicesToStop = this._getDevicesToScan()
        devicesToStop.forEach((device)=>{
            const cmdStr = this.commands.stopScan.cmd.replace('*',device.index)
            const newCmd = {type: this.commands.stopScan.type, cmd: cmdStr}
        })
        this.stop() // Clear interval

    }
    _fetchScanData(){
        //Iterate over list of devices that are scanning
        //Send commands to retrieve data from them
        //Organize data and update _scanData acordingly
        //Call event handler to let clients know data is updated

        const devicesToPoll = this._getDevicesToScan()
        devicesToPoll.forEach((device)=>{
            const cmdStr = this.commands.polScan.cmd.replace('*',device.index)
            const newCmd = {type: this.commands.polScan.type, cmd: cmdStr, index:device.index}
            this.sendCmd(newCmd)
        })
        
    } 
    _getDevicesToScan(){
        //Iterate over known devices
        //Calculate which devices are unique and set a 'scan' flag
        //Return array of references to the devices
        const devices = this._getDeviceData()
        if(devices.length === 0 ){throw new Error('Scan Error: device must be connected first')}
        return devices.filter((item,index)=>{ //Compares each item's block value and filters diplicates
            return devices.findIndex((item2)=>item2.block === item.block) === index
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
            case eventTypes.SCAN_START:
                console.log('Started scan', result)
                break;
            case eventTypes.SCAN_POLL:
                console.log(`Got data for reciever: ${result.index}`,result.payload)
                break;
            default:
                console.log(`Unknown message type: ${result}`)
                break;
        }
        console.log(this._msgQueue)
    }
    _jobErrorHandler(error){
        this._msgQueue.end()
        this.stop()
        console.log(error);
        this.errorHandler && this.errorHandler(error)
    }
    _getDeviceData(){
        return this._deviceData.blocks.map((block,i)=>{
            return {
                index: i + 1,
                block: block,
                frequency: parseFloat(this._deviceData.frequencies[i]),
                voltage: parseFloat(this._deviceData.voltages[i]),
                pilot: this._deviceData.pilotTones[i]
            }
        })
    }
}