/**
|--------------------------------------------------
| Interface for Venue 2 devices
| 2019 Dana Simmons
|--------------------------------------------------
*/

import Device from './libDevice';
import events from './events'

const DEBUG = true;
const blocks = require('./blocks.json');

export default class VRM2WB extends Device {
    constructor(options){
        super(options)
        //Initialize with 6 channels
        this._fetchData = this._fetchData.bind(this)
        this._fetchScanData = this._fetchScanData.bind(this)
        this._deviceData = Device.initDeviceData(6)
    }
    
    commands = { 
        deviceId: {type: events.ID, cmd:() => 'id ?\r'},        //Device type
        blocks:   {type: events.BLOCKS, cmd:( index ) => `rxblock(${ index }) ?\r`},    //Reciever block
        battVolt: {type: events.BATTERY_VOLTAGE, cmd:() => 'txblevel(*) ?\r'}, //Battery voltage
        battType: {type: events.BATTERY_TYPE, cmd:() =>  'txbatt(*) ?\r'}, //Battery type as set in the device
        pilot:    {type: events.PILOT_TONE, cmd:() => 'rxlink(*) ?\r'},    //Pilot tone status
        rxmeter:  {type: events.RF_LEVEL, cmd:() => 'rmeter(*) ?\r'},  //Signal strength
        freqs:    {type: events.FREQUENCIES, cmd:() =>  'rxfreq(*) ?\r'},       //Frequenies of the recievers
        startScan:{type: events.SCAN_START, cmd:(index) =>  `rxscan(${index})=1\r`} ,
        stopScan: {type: events.SCAN_STOP, cmd:(index) =>  `rxscan(${index})=0\r`},
        polScan:  {type: events.SCAN_POLL, cmd:(index) =>  `pollsd(${index})? $\r`},
        outLevel: {type: events.OUT_LEVEL, cmd:() =>  'rxalevel(*) ?\r'},
        setLevel: {type: events.SET_CHANGE, cmd: ([ index, level ]) => `rxalevel(${ index })=${ level }\r`},
        setFreq:  {type: events.SET_CHANGE, cmd: ([ index, freq ]) => `rxfreq(${ index })=${ freq }\r`},
        setBattType: {type: events.SET_CHANGE, cmd: ([ index, type ]) => `txbatt(${ index })=${ type }\r`}
    }
    
    _batteryTypes = {
        "0": "AA Alkaline",
        "1": "AA Lithium",
        "2": "9V Alkaline",
        "3": "9V Lithium"
    }
    _fetchData(){
        this._deviceData.forEach( ch => { //query block for each channel
            const newCmd = {...this.commands.blocks, index: ch.index}
            this.sendCmd(newCmd,ch.index)
        })
        this.sendCmd(this.commands.battType)
        this.sendCmd(this.commands.freqs)
        this.sendCmd(this.commands.battVolt)
        this.sendCmd(this.commands.outLevel)
        this.sendCmd(this.commands.pilot)
    }
    _startScan(){
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


        const devicesToPoll = this._getDevicesToScan()
        devicesToPoll.forEach((device)=>{
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
        DEBUG && console.log("Recieved Result:",result)
        switch (result.type) {
            case events.BLOCKS:
                const {index} = result
                this._deviceData[index - 1].block = this._parseData(result.payload)[0] //TODO: can this be less ugly?
                break;
            case events.BATTERY_TYPE:
                console.log("Todo: do something with battery types")
                break;
            case events.FREQUENCIES: {
                const dataArray = this._parseData(result.payload).map( freq => parseFloat(freq) / 1000 )
                this._updateDeviceData({prop: "frequency", dataArray})
                break;
            }
            case events.BATTERY_VOLTAGE: {
                const dataArray = this._parseData(result.payload).map( volt => parseFloat( volt ) / 100 )
                this._updateDeviceData({prop: "voltage", dataArray})
                break;
            }
            case events.OUT_LEVEL: {
                const dataArray = this._parseData(result.payload).map( lvl => parseInt( lvl ))
                this._updateDeviceData({prop: "level", dataArray})
                break;
            }
            case events.PILOT_TONE: {
                const dataArray = this._parseData(result.payload)
                this._updateDeviceData({prop: "pilot", dataArray})
                this.dataHandler() // fire callback with new data
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
                break;
        }
    }

    _jobErrorHandler(error){ //Handle an error from the message qeue
        this._msgQueue.end()
        this.stop()
        this._stopScan()
        this.errorHandler && this.errorHandler(error)
    }

    _getDeviceData(){
        return this._deviceData
    }
    _getScanData(){
        return Object.values(this._scanData)
    }    
}