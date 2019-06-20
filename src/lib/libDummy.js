/**
|--------------------------------------------------
| Dummy Test class for Pocket Venue
| 2019 Dana Simmons
|--------------------------------------------------
*/
import Device from './libDevice'

const blocks = require('./blocks.json')

export default class Dummy extends Device {
    constructor(options){
        super(options)
        this._fetchData = this._fetchData.bind(this)
        this._fetchScanData = this._fetchScanData.bind(this)
    }
    _batteryTypes = {
        0: "9V Alkaline",
        1: "9V Lithium",
        2: "9V Timer",
        3: "AA Alkaline",
        4: "AA Lithium",
        5: "AA Timer"
    }
    _batteryTypes = {
        0: "9V Alkaline",
        1: "9V Lithium",
        2: "9V Timer",
        3: "AA Alkaline",
        4: "AA Lithium",
        5: "AA Timer"
    }
    _getScanData(){
        //Return scan data array
        return [
            {index: 1, block: 19, ...blocks[19], scan:Array(256).fill(10) }
        ]
    }
    _getDeviceData(){
        //Return device data array
        return [
            {index: 1, label: "Ch 1 Test", block: 19, frequency: 500, voltage: 1.4, pilot: "1"},
            {index: 2, label: "Ch 2 Test", block: 19, frequency: 510, voltage: 1.4, pilot: "1"},
            {index: 3, label: "Ch 3 Test", block: 19, frequency: 490, voltage: 1.4, pilot: "1"},
            {index: 4, label: "Ch 4 Test", block: 19, frequency: 495, voltage: 1.4, pilot: "1"},
            {index: 5, label: "Ch 5 Test", block: 19, frequency: 505, voltage: 1.4, pilot: "1"},
            {index: 6, label: "Ch 6 Test", block: 19, frequency: 512, voltage: 1.4, pilot: "1"}
        ]
    }
    _fetchData(){
        this.dataHandler()
        //Do Nothing
    }
    _stopScan(){
        //Do Nothing
    }
    _startScan(){
        //Do nothing
    }

    _fetchScanData(){
        this.scanDataHandler(this.scanData)
        //Do Nothing
    }

}