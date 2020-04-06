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
        deviceId: ( ) => ({ type: events.ID, cmd: 'id ?\r' }),                                    //Device type
        blocks:   ( index ) => ({ type: events.BLOCKS, index, cmd: `rxblock(${ index }) ?\r` }),  //Reciever block
        battVolt: ( ) => ({ type: events.BATTERY_VOLTAGE, cmd: 'txblevel(*) ?\r' }),              //Battery voltage
        battType: ( ) => ({ type: events.BATTERY_TYPE, cmd: 'txbatt(*) ?\r' }),                   //Battery type as set in the device
        pilot:    ( ) => ({ type: events.PILOT_TONE, cmd: 'rxlink(*) ?\r' }),                     //Pilot tone status
        rxmeter:  ( ) => ({ type: events.RF_LEVEL, cmd: 'rmeter(*) ?\r' }),                       //Signal strength
        freqs:    ( ) => ({ type: events.FREQUENCIES, cmd: 'rxfreq(*) ?\r' }),                    //Frequenies of the recievers
        rxpresent:( ) => ({ type: events.RX_PRESENT, cmd: 'rxpresent(*) ?\r' }),                  // Channels with recievers installed
        startScan:( index ) => ({ type: events.SCAN_START, index, cmd: `rxscan(${ index })=1\r` }),       // Send start scan command
        stopScan: ( index ) => ({ type: events.SCAN_STOP, index, cmd:`rxscan(${ index })=0\r` }),         //Send stop scan command
        polScan:  ( index ) => ({ type: events.SCAN_POLL, index, cmd: `pollsd(${ index })? $\r` }),
        outLevel: ( ) => ({ type: events.OUT_LEVEL, cmd: 'rxalevel(*) ?\r' }),
        setLevel: ( index, level ) => ({ type: events.SET_CHANGE, index, cmd: `rxalevel(${ index })=${ level }\r` }),
        setFreq:  ( index, freq ) => ({ type: events.SET_CHANGE, cmd: `rxfreq(${ index })=${ freq * 1000 }\r` }),
        setBattType: ( index, type ) => ({ type: events.SET_CHANGE, cmd: `txbatt(${ index })=${ type }\r` }),
        rxLabel: ( index ) =>  ({ type: events.RX_LABEL, index, cmd: `rxname(${index}) ?\r` }),
        setRxLabel: ( index, label ) =>  ({ type: events.SET_CHANGE, index, cmd: `rxname(${ index })="${label}"\r` })
    }
    
    _batteryTypes = {
        "0": "AA Alkaline",
        "1": "AA Lithium",
        "2": "9V Alkaline",
        "3": "9V Lithium"
    }

    _fetchData(){
        this._deviceData.forEach( ch => { //query block and label for each channel
            this.sendCmd(this.commands.blocks( ch.index ))
            this.sendCmd(this.commands.rxLabel( ch.index ))
        })
        this.sendCmd(this.commands.battType())
        this.sendCmd(this.commands.freqs())
        this.sendCmd(this.commands.battVolt())
        this.sendCmd(this.commands.battType())
        this.sendCmd(this.commands.outLevel())
        this.sendCmd(this.commands.pilot())
    }

    _startScan(){
        const devices = this._getDevicesToScan()
        devices.forEach((device)=>{        
            this.sendCmd( this.commands.startScan( device.index ))
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
        devicesToStop.forEach(( device )=>{
            this.sendCmd( this.commands.stopScan( device.index ))
        })
        this.stop() // Clear interval

    }

    _fetchScanData(){
        const devicesToPoll = this._getDevicesToScan()
        devicesToPoll.forEach((device)=>{
            this.sendCmd( this.commands.polScan( device.index ))
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
            case events.BLOCKS:{
                const {index} = result
                this._deviceData[index - 1].block = this._parseData(result.payload)[0] //TODO: can this be less ugly?
                break;
            }
            case events.RX_LABEL:{
                const { index } = result
                this._deviceData[index - 1].label = this._parseData(result.payload)[0] || ""
                break;
            }
            case events.BATTERY_TYPE: {
                const dataArray = this._parseData(result.payload)
                this._updateDeviceData({prop: "batteryType", dataArray})
                break;
            }
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
        //WARNING: this causes a loop when there is no connection to a device
        //this._stopScan()
        this.errorHandler && this.errorHandler(error)
    }

    _getDeviceData(){
        return this._deviceData
    }

    _getScanData(){
        return Object.values(this._scanData)
    } 

    _setChannelSettings({index, label="", level, batteryType, frequency }){
        if([index, label, level, batteryType, frequency].includes(undefined)){
            throw new Error("Data Error: missing required key in channel data object")
        }
        // {index, level, battType, frequency, }
        this.sendCmd( this.commands.setLevel( index, level ));
        this.sendCmd(this.commands.setBattType( index, batteryType ))
        this.sendCmd(this.commands.setFreq( index, frequency ))
        this.sendCmd(this.commands.setRxLabel( index, label ))
    }
}