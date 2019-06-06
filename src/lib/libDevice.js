
/**
|--------------------------------------------------
| Abstract Class for connecting to Lectrosonics Devices
| 2019 Dana Simmons
|--------------------------------------------------
*/
const net = require('react-native-tcp')
const encoding = 'utf8'

function sendCmd({address,port},cmd) {
    const client = net.createConnection(port,address,()=>{
        client.write(cmd)
    })
    return new Promise(function(resolve,reject){
        client.on('data',(data)=>{
            client.destroy()
            resolve(data.toString(encoding))
        })
        client.on('error',(error)=>{
            client.destroy()
            reject(error)
        })
    })

}

export default class Device {
    constructor({type,name,address,port}){
        if (!type || !name || !address || !port)
            throw new Error('Missing required option')
        this.address = address
        this.port = port
        this.type = type
        this.name = name
        this._sendCmd = this._sendCmd.bind(this)
        this._intervalRef = null
        this._deviceData = []
        this._scanData = []
        this.dataHandler = null
        this.errorHandler = null
        this.fetchData = this.fetchData.bind(this)
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.startScan = this.startScan.bind(this)
        this.stopScan = this.stopScan.bind(this)
        this.fetchData = this.fetchData.bind(this)
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
    _isOK(response){
        okCheck = RegExp(/OK .*/)
        return okCheck.test(response)
    }
    _sendCmd(cmd){
        return sendCmd(this._connectObj,cmd) //Promise for data
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

        this._intervalRef = setInterval(()=>{
            this._pollScanData(callback())
        },refreshInterval)
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