/**
|--------------------------------------------------
| Interface for Venue Wide Band devices
| 2019 Dana Simmons
|--------------------------------------------------
*/

import Device from './libDevice'
import events from './events';

const DEBUG = true //Switch to true to enable more console.logs

const blocks = require('./blocks.json')

export default class VRWB extends Device {
    constructor(options){
        super(options) 
        this._fetchData = this._fetchData.bind(this)
        this._fetchScanData = this._fetchScanData.bind(this)
        this._deviceData = Device.initDeviceData(6)
    }
    commands = {
        deviceId: {type: events.ID, cmd:() => 'id ?\r'},        //Device type
        blocks:   {type: events.BLOCKS, cmd:() => 'block(*) ?\r'},    //Reciever blocks
        battVolt: {type: events.BATTERY_VOLTAGE, cmd:() => 'bvolts(*) ?\r'}, //Battery voltage
        battType: {type: events.BATTERY_TYPE, cmd:() =>  'txbatt(*) ?\r'}, //Battery type as set in the device
        pilot:    {type: events.PILOT_TONE, cmd:() => 'signal(*) ?\r'},    //Pilot tone status
        rxmeter:  {type: events.RF_LEVEL, cmd:() => 'rmeter(*) ?\r'},  //Signal strength
        freqs:    {type: events.FREQUENCIES, cmd:() =>  'mhz(*) ?\r'},       //Frequenies of the recievers
        startScan:{type: events.SCAN_START, cmd:(index) =>  `rxscan(${index})=1\r`} ,
        stopScan: {type: events.SCAN_STOP, cmd:(index) =>  `rxscan(${index})=0\r`},
        polScan:  {type: events.SCAN_POLL, cmd:(index) =>  `pollsd(${index})? $\r`},
        outLevel: {type: events.OUT_LEVEL, cmd:() =>  'level(*) ?\r'},
        setLevel: {type: events.SET_CHANGE, cmd: ([ index, level ]) => `level(${ index })=${ level }\r`},
        setFreq:  {type: events.SET_CHANGE, cmd: ([ index, freq ]) => `mhz(${ index })=${ freq }\r`},
        setBattType: {type: events.SET_CHANGE, cmd: ([ index, type ]) => `txbatt(${ index })=${ type }\r`}
    }
    
    _batteryTypes = {
        "0": "9V Alkaline",
        "1": "9V Lithium",
        "2": "9V Timer",
        "3": "AA Alkaline",
        "4": "AA Lithium",
        "5": "AA Timer"
    }
    _startScan(){
        //Initate scan process for uniqe Recievers
        const devices = this._getDevicesToScan()
        devices.forEach((device)=>{
            
            this.sendCmd(this.commands.startScan, device.index)

            //Initialize data structure
            const scanLength = blocks[device.block].scanLength
            const start = blocks[device.block].start
            const end = blocks[device.block].end
            
            this._scanData = Object.assign(this._scanData, { //TODO: this structure can be combined with _deviceData
                [device.index] : {
                    block: device.block, 
                    scan: Array(scanLength).fill(0),
                    start,
                    end
                }
            })

        })

    }
    _stopScan(){
        const devicesToStop = this._getDevicesToScan()
        devicesToStop.forEach((device)=>{
            this.sendCmd(this.commands.stopScan, device.index)
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
            // const cmdStr = this.commands.polScan.cmd.replace('*',device.index)
             const newCmd = {...this.commands.polScan, index: device.index}
            this.sendCmd(newCmd, device.index)
        })
        
    } 
    _getDevicesToScan(){
        const devices = this.deviceData
        if(devices.length === 0 ){throw new Error('Scan Error: device must be connected first')}
        return devices.filter((item,index)=>{ //Compares each item's block value and filters diplicates
            return devices.findIndex((item2)=>item2.block === item.block) === index
        })
    }
    _fetchData(){
        this.sendCmd(this.commands.blocks)
        this.sendCmd(this.commands.battType)
        this.sendCmd(this.commands.freqs)
        this.sendCmd(this.commands.battVolt)
        this.sendCmd(this.commands.outLevel)
        this.sendCmd(this.commands.pilot) //Should be last to trigger data update
    }
    _updateScanData(response){
        if(!response.index){
            throw new Error("updateScanData requires a reciever index to associate data with")
        }
        const {offset, data} = this._parseScanPacket(response.payload)
        const scanLength = this._scanData[response.index].scanLength
        if(offset > scanLength){ //Adjust offset for array length
            offset = offset - scanLength
        }
        data.forEach((value,i)=>{
            this._scanData[response.index].scan[offset + i] = value
        })
        DEBUG && console.log('this._scanData', this._scanData)
        this.scanDataHandler(this.scanData)
    }
    _updateDeviceData({prop, dataArray}){
        const newData = this._deviceData.map(( channel, i) => {
            const newChannel = Object.assign({}, channel, { [prop] : dataArray[i] })
            return newChannel
        })
        DEBUG && console.log("Updating device data:",newData);
        this._deviceData = newData
    }
    _jobSuccessHandler(result,job){
        DEBUG && console.log("Recieved result:",result);
        switch (result.type) {
            case events.BLOCKS: {
                const dataArray = this._parseData(result.payload)
                this._updateDeviceData({ prop: "block", dataArray })
                break; 
            }
            case events.FREQUENCIES: {
                const dataArray = this._parseData(result.payload).map( freq => parseFloat( freq ))
                this._updateDeviceData({prop: "frequency", dataArray})
                break;
            }
            case events.BATTERY_VOLTAGE: {
                const dataArray = this._parseData(result.payload).map( volt => parseFloat( volt ) / 100 )
                this._updateDeviceData({ prop: "voltage", dataArray })
                break;
            }
            case events.BATTERY_TYPE: {
                const dataArray = this._parseData(result.payload)
                this._updateDeviceData({ prop: "batteryType", dataArray })
                break;
            }
            case events.PILOT_TONE: {
                const dataArray = this._parseData(result.payload)                
                this._updateDeviceData({ prop: "pilot", dataArray })
                this.dataHandler()
                break;
            }
            case events.OUT_LEVEL: {
                const dataArray = this._parseData(result.payload).map( level => parseInt( level ))
                this._updateDeviceData({ prop: "level", dataArray })
                break;
            }
            case events.SCAN_START: 
                DEBUG && console.log('Started scan', result)
                break;
            case events.SCAN_POLL:
                this._updateScanData(result)
                break;
            case events.SET_CHANGE:
                this.fetchData() //Refresh data after a setting change
                break;
            default:
                DEBUG && console.log(`Unknown message type: ${result}`)
                break;
        }
        DEBUG && console.log(this._msgQueue)
    }
    _jobErrorHandler(error){
        this._msgQueue.end() //Important to stop the queue as soon as anything goes wrong.
        this.stop()
        this._stopScan() //Just in case an error happens while scanning, shut down the remote device
        DEBUG && console.log(error);
        this.errorHandler && this.errorHandler(error)
    }
    _calculateHexValue(block,frequency){
        const startFreq = blocks[block].start
        const steps = (frequency - startFreq) * 10 //assume 100k stepsize
        return parseInt(steps,10).toString(16) //avoid weird javascript math errors
    }
    _getDeviceData(){
        return this._deviceData
    }
    _getScanData(){
        return Object.values(this._scanData)
    }
    _setChannelSettings({index, level, batteryType, frequency }){
        if([index, level, batteryType, frequency].includes(undefined)){
            throw new Error("Data Error: missing required key in channel data object")
        }
        // {index, level, battType, frequency, }
        this.sendCmd(this.commands.setLevel,[index,level]);
        this.sendCmd(this.commands.setBattType,[index,batteryType])
        this.sendCmd(this.commands.setFreq,[index,frequency])
    }
}