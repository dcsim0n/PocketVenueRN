
/**
|--------------------------------------------------
| Abstract Class for connecting to Lectrosonics Devices
| 2019 Dana Simmons
|--------------------------------------------------
*/
const net = require('react-native-tcp')
const Queue = require('queue')
const encoding = 'utf8'

function isOK(response){
    okCheck = RegExp(/OK .*/)
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
    constructor({type,name,address,port,timeout=500,concurrency=1,autostart=true}){
        if (!type || !name || !address || !port)
            throw new Error('Missing required option')
        this.address = address
        this.port = port
        this.type = type
        this.name = name
        this._intervalRef = null
        this._deviceData = {}
        this._scanData = []

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
            if(this.fetchData === undefined)
                throw new Error("Error: fetchData is not defined. fetchData should be defined by a child class")
            this._intervalRef = setInterval(this.fetchData,refreshInterval)
            this.fetchData() 
        }else{
            console.log("Notice: Device.start() called but device is alreaded connected")
        }//Else we are already scanning
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
        return this._getScanData() //Delegat to per device implementation
    }
    
    sendCmd(cmd){
        this._msgQueue.push((callback)=>{
            netSend(this.connectObj,cmd.cmd) //Promise for data
            .then((data)=>{
                callback(null, {...cmd, payload: data})
            },(error)=>{
                callback(error)
            })
        })
    }
    
    _parseData(data){
        //maybe this should handle other formats of string?
       return data.split(/OK\s{|,|}/).filter((x)=>(x=='' || x=='\r\n') ? false : true)
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
}