
/**
|--------------------------------------------------
| Abstract Class for connecting to Lectrosonics Devices
| 2019 Dana Simmons
|--------------------------------------------------
*/
const DEBUG = true //Switch to true to turn on more console.logs

const net = require('react-native-tcp')
const Queue = require('queue')
const encoding = 'utf8'

function isOK(response){
    okCheck = RegExp(/OK.*/)
    return okCheck.test(response)
}
 
function netSend({address,port},cmd) { //Wrapper for net tcp opperations
    const client = net.createConnection(port,address,()=>{
        client.write(cmd)
    })
    return new Promise((resolve,reject)=>{
        client.on('data',(data)=>{
            client.destroy()
            const decodedData = data.toString(encoding)
            if(isOK(decodedData)){
                resolve(decodedData)
            }else{
                DEBUG && console.log("Recieved bad response",decodedData)
                reject(new Error("Recieved error from Device"))
            }
        })
        client.on('error',(error)=>{
            client.destroy()
            reject(error)
        })
    })

}

export default class Device {
    constructor({type,name,address,port,timeout=1000,concurrency=1,autostart=true}){
        if (!type || !name || !address || !port)
            throw new Error('Missing required option')

        //Internal state
        this.address = address
        this.port = port
        this.type = type
        this.name = name
        this._intervalRef = null
        this._deviceData = []
        this._scanData = {}

        // Public interface methods
        this.dataHandler = null
        this.errorHandler = null
        this.scanDataHandler = null
        this.scanErrorHandler = null
        this.sendCmd = this.sendCmd.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.startScan = this.startScan.bind(this)
        this.stopScan = this.stopScan.bind(this)
        this.fetchData = this.fetchData.bind(this)

        // Private message queue
        this._msgQueue = Queue({concurrency,timeout,autostart})
        this._msgQueue.on('success',(r,j)=>this._jobSuccessHandler(r,j))
        this._msgQueue.on('error',(e)=>this._jobErrorHandler(e))
    }
    
    //Status information interface
    start(refreshInterval,callback,errorHandler=null){
        if(this._intervalRef === null){ //Check if the interval is already running
            this.dataHandler = callback
            this.errorHandler = errorHandler
            if(this._fetchData === undefined)
                throw new Error("Error: fetchData is not defined. fetchData should be defined by a child class")
            this._intervalRef = setInterval(this.fetchData,refreshInterval)
            this.fetchData() 
        }else{
            DEBUG && console.log("Notice: Device.start() called but device is alreaded connected")
        }
    }
    
    stop(){
        clearInterval(this._intervalRef)
        this._intervalRef = null
    }

    get connectObj (){
        return {port: this.port, address: this.address}
    }
    get deviceData (){
        return this._getDeviceData() //Delegate to device implementation
    }

    get scanData(){
        return this._getScanData() //Delegate to per device implementation
    }
    get BatteryTypes(){
        return this._batteryTypes
    }
    static initDeviceData(numOfChannels){
        let initData = []
        for (let i = 0; i < numOfChannels; i++){
                initData.push({
                index: i + 1,
                block: "",
                frequency: 0,
                voltage: 0,
                level: 0,
                pilot: "0",
                batteryType: "",
                hex: "",
                enabled: false,
                txblock: "",
                scanData: []
            })
        }
        DEBUG && console.log("Device Channels:", this.numOfChannels)
        DEBUG && console.log("Initialized deviceData", initData)
        return initData;
    }
    sendCmd(cmd,args){
        this._msgQueue.push((callback)=>{
            netSend(this.connectObj,cmd.cmd(args)) //Promise for data
            .then((data)=>{
                callback(null, {...cmd, payload: data})
            },(error)=>{
                callback(error)
            })
        })
    }

    // Scanning interface
    startScan(refreshInterval,callback,errorHandler=null){
        //set up a recuring interval
        this._startScan()
        //TODO: the data handler could accept an error and eliminate the errorHandler
        this.scanDataHandler = callback
        this.scanErrorHandler = errorHandler
        this._intervalRef = setInterval(this._fetchScanData,refreshInterval)
        
    }

    stopScan(){
        this._stopScan()
        clearInterval(this._intervalRef)
        this._intervalRef = null
    }
    fetchData(){
        this._fetchData() //Must be defined by child
    }
    setChannelSettings(channelData){
        this._setChannelSettings(channelData)
    }
    _parseData(data){
        //this can handle strings like "OK {x,y,z}" and 'OK "DATA" ' 
       return data.split(/OK\s[{\"]|,|[}\"]/).filter((x)=>(x=='' || x=='\r\n') ? false : true)
    }

    _parseScanPacket(data){
        /**
        |--------------------------------------------------
        | Packet: [ 4 char status code ] [ 264 char status blob ] [ 4 char offset ] [ array of 2 char scan data + '\n' ]
        |--------------------------------------------------
        */
        const statusIndex = 0
        const blobIndex = 4
        const offsetIndex = 268
        const scanIndex = 272
        const status = data.slice(statusIndex,blobIndex)
        const blob = data.slice(blobIndex,offsetIndex)
        const offsetBlob = {
            msb: data.slice(offsetIndex, offsetIndex + 2),
            lsb: data.slice(offsetIndex + 2,offsetIndex + 4)
        }
        const scanBlob = data.slice(scanIndex).trim()

        if(DEBUG){
            console.groupCollapsed("Parsed Packet")
            console.log('data', data)
            console.log('status', status)
            console.log("offsetBlob", offsetBlob)
            console.log('scanBlob', scanBlob)
            console.groupEnd()
        }

        
        if((scanBlob.length % 2) !== 0){
            throw new Error("Device Error: recieved an odd number of scan bytest")
        }
        
        const offset = parseInt(offsetBlob.msb, 16) + parseInt(offsetBlob.lsb, 16)
        const scanInts = []
        for (let i = 0; i < scanBlob.length; i = i + 2 ){
            const hexByte = scanBlob.slice(i,i+2)
            scanInts.push(parseInt(hexByte,16))
        }

        return {offset,data:scanInts}
    }
}