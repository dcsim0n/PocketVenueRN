
/**
|--------------------------------------------------
| Abstract Class for connecting to Lectrosonics Devices
| 2019 Dana Simmons
|--------------------------------------------------
*/
const net = require('react-native-tcp')
const Queue = require('queue')
const encoding = 'utf8'

function _isOK(response){
    okCheck = RegExp(/OK .*/)
    return okCheck.test(response)
}
function netSend({address,port},cmd) {
    const client = net.createConnection(port,address,()=>{
        client.write(cmd.cmd)
    })
    return new Promise((resolve,reject)=>{
        client.on('data',(data)=>{
            client.destroy()
            if(_isOK(data)){
                resolve({type: cmd.type, payload: data.toString(encoding)})
            }else{
                reject({type:cmd.type,payload:"Device Error: recieved error from device"})
            }
        })
        client.on('error',(error)=>{
            client.destroy()
            reject({type: cmd.type, payload: error})
        })
    })

}

export default class Device {
    constructor({type,name,address,port,timeout=500,concurrency=1,autostart=true}){
        if (!type || !name || !address || !port)
            throw new Error('Missing required option')
        this.address = address
        this.port = port
        this.type = type
        this.name = name
        this._intervalRef = null
        this._deviceData = []
        this._scanData = []
        this.dataHandler = null
        this.errorHandler = null
        this._sendCmd = this._sendCmd.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.startScan = this.startScan.bind(this)
        this.stopScan = this.stopScan.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this._msgQueue = Queue({concurrency,timeout,autostart})
        this._msgQueue.on('success',this._jobSuccessHandler)
        this._msgQueue.on('error',this._jobErrorHandler)
    }
    get _connectObj (){
        return {port: this.port, address: this.address}
    }
    get deviceData (){
        return this._deviceData
    }

    get scanData(){
        return this._scanData
    }
    
    _sendCmd(cmd){
        // return netSend (this._connectObj,cmd) //Promise for data
        this._msgQueue.push(()=>{
            return netSend(this._connectObj,cmd) //Promise for data
        })
    }
    
    _parseData(data){
        //maybe this should handle other formats of string?
       return data.split(/OK\s{|,|}/).filter((x)=>x!=='')
    }

    start(refreshInterval,callback,errorHandler=null){
        if(this._intervalRef === null){
            this.dataHandler = callback
            this.errorHandler = errorHandler
            if(this.fetchData === undefined)
                throw new Error("Error: fetchData is not defined. fetchData should be defined by a child class")
            this._intervalRef = setInterval(this.fetchData,refreshInterval)
            this.fetchData
        }else{
            console.log("Notice: Device.start() called but device is alreaded connected")
        }//Else we are already scanning
    }

    startScan(refreshInterval,callback,errorHandler=null){
        
        //Make sure we aren't connected already!
        if(this._intervalRef !== null){
            throw new Error("Scan Error: device is already connected and running, call Device.stop() first")
        }

        this._startScan()

        // this._intervalRef = setInterval(()=>{
        //     this._pollScanData(callback())
        // },refreshInterval)
    }

    stop(){
        clearInterval(this._intervalRef)
        this._intervalRef = null
    }
    
    stopScan(){
        this._stopScan()
        clearInterval(this._intervalRef)
        this._intervalRef = null
    }
    fetchData(){
        this._fetchData() //Must be defined by child
    }
}