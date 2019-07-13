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
        
    }
    numOfChannels = 6
    commands = { //TODO: verify these commands for Venue 2!
        deviceId: {type: events.ID, cmd:() => 'id ?\r'},        //Device type
        blocks:   {type: events.BLOCKS, cmd:( index ) => `rxblock(${ index }) ?\r`},    //Reciever blocks
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
        this.sendCmd(this.commands.battType)
        this.sendCmd(this.commands.freqs)
        this.sendCmd(this.commands.battVolt)
        this.sendCmd(this.commands.outLevel)
        this.sendCmd(this.commands.pilot)
    }


    _jobSuccessHandler(result,job){
        debug && console.log("Recieved Result:",result)
        switch (result.type) {
            case events.BLOCKS:
                console.log("Todo: do something with blocks")
                break;
            case events.BATTERY_TYPE:
                console.log("Todo: do something with battery types")
                break;
            case events.FREQUENCIES:
                console.log("Todo: do something with frequencies")    
                break;
            case events.BATTERY_VOLTAGE:
                console.log("Todo: do something with battery voltage")
                break;
            case events.OUT_LEVEL:
                console.log("Todo: do something with output level")
                break;
            case events.PILOT_TONE:
                console.log("Todo: do somethgin with pilot tones")
                this.dataHandler() // fire callback with new data
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
        console.log("Todo: do something with data and return it")
    }
    _stopScan(){
        console.log("Todo: stop the scanning process!");
    }
    
}