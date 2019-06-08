/**
|--------------------------------------------------
| Interface for Venue Wide Band devices
| 2019 Dana Simmons
|--------------------------------------------------
*/
import Device from './libDevice'
const blocks = require('./blocks.json')
class VrwbReciever {
    constructor({index,block}){
        this.index = index
        this.block = block
        this.scanData = []
    }
    get blockBoundary(){
        return blocks[this.block]
    }
    startScan(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                resolve("todo: start scan proccess")
            },1000)
        })
    }
    pollScan(){
        console.log("todo: poll data")
    }
    stopScan(){
        console.log("todo: stop scanning")
    }
    //Other methods
}
class QueNode{
    constructor(node){
        this.nextNode = null
        this.prevNode = null
        this.node = node
    }
}

class ScanQue{
    constructor(){
        this.first = null   
        this.add = this.add.bind(this)
    }
    get last(){
        let currentNode = this.first
        while(currentNode.nextNode != null ){
            currentNode = currentNode.nextNode
        }
        return currentNode
    }
    add(node){
        const newNode = new QueNode(node)
        if(this.first == null){
            this.first = newNode
            
        }else{
            this.last.nextNode = newNode
        }
        console.log("added new node",this.first,this.last)
    }
}
export default class VRWB extends Device {
    constructor(options){
        super(options) 
        this.commands = {
            deviceId: 'id ?\r',        //Device type
            blocks: 'block(*) ?\r',    //Reciever blocks
            battVolt: 'bvolts(*) ?\r', //Battery voltage
            battType: 'txbatt(*) ?\r', //Battery type as set in the device
            pilot: 'signal(*) ?\r',    //Pilot tone status
            rxmeter: 'rmeter(*) ?\r',  //Signal strength
            freqs: 'mhz(*) ?\r',       //Frequenies of the recievers
            startScan: 'rxscan(*) = 1\r',
            stopScan: 'rxscan(*) = 0\r',
            polScan: 'polsd(*) ?\r'
        }
        this.vrScanQue = new ScanQue()
        
    }
    _initScanQue = ()=>{ //arrow function to bind context
        // this._sendCmd(this.commands.blocks)
        // .then(resp=>{
        //     if(this._isOK(resp)){
        const blocks = this._getDevicesToScan()
        for (let i = 0; i < blocks.length; i++){
            const newRxNode = new VrwbReciever ({index: blocks[i].index , block: blocks[i]})
            console.log("adding new vrnode",newRxNode)
            this.vrScanQue.add(newRxNode)
        }
        //     }else{
        //         throw new Error("Device Error: recieved bad response from device")
        //     }
        // })
    }
    _startScan(){
        this._initScanQue()
        console.log(this.vrScanQue)
        this._sendRecursively(this.commands.startScan,this.vrScanQue.first)

    }
    _stopScan(){
        const devicesToStop = this._getDevicesToScan()
        this._sendAsync(this.commands.stopScan,devicesToStop)

    }
    _pollScanData(){
        //Iterate over list of devices that are scanning
        //Send commands to retrieve data from them
        //Organize data and update _scanData acordingly
        //Call event handler to let clients know data is updated

        const devicesToPoll = this._getDevicesToScan()
        this._sendRecursively(this.commands.polScan,devicesToPoll)
        
    } 
    _getDevicesToScan(){
        //Iterate over known devices
        //Calculate which devices are unique and set a 'scan' flag
        //Return array of references to the devices

        if(this._deviceData.length === 0 ){throw new Error('Scan Error: device must be connected first')}
        return this._deviceData.filter((item,index)=>{ //Compares each item's block value and filters diplicates
            return this.deviceData.findIndex((item2)=>item2.block === item.block) === index
        })

    }
    _fetchData(){
        // The nested tcp requests is a
        // limitation of the Venue WB,
        // it can't handle concurent connections
        // requests must be serial in nature
        const commands = this.commands
            this._sendCmd(commands.freqs)
            .then(data=>{
                const freqs = this._parseData(data)
                this._sendCmd(commands.blocks)
                .then((data)=>{
                    const blocks = this._parseData(data)
                    this._sendCmd(commands.battVolt)
                    .then(data=>{
                        const volts = this._parseData(data)
                        this._sendCmd(commands.pilot)
                        .then(data=>{
                            const pilots = this._parseData(data)
                            
                            let retData = []
                            
                            for (let i = 0; i<6; i++){
                                retData.push({
                                    index: i + 1, //Reciever address start at one
                                    block: blocks[i],
                                    frequency: parseFloat(freqs[i]),
                                    voltage: (parseFloat(volts[i])/100),
                                    pilot: pilots[i]
                                })
                            }
                            this._deviceData = retData
                            this.dataHandler(data) //Call handler with our data
                        })
                    })
                })
            }).catch((error)=>{
                if(this.errorHandler){
                    this.errorHandler(error)
                }else{
                    throw error
                }
            })
    }
    _sendRecursively =(cmd,node)=>{
        console.log(node)
        node.node.startScan()
        .then((resp)=>{
            console.log(resp)
            if(node.nextNode != null){
                this._sendRecursively("",node.nextNode)
            }
        })
    }

    async _sendAsync(cmd,devices){ // cmd should be a string with a '*' character where the device address will go
        devices.forEach(async (item)=>{
            const cmdString = cmd.replace('*',item.index)
            const resp = await this._sendCmd()
            if(this._isOK(resp)){
                //doe something else?
                console.log('success', resp)
            }else{
                throw new Error("Device Error: recieved error from device")
            }
        })
    }
}