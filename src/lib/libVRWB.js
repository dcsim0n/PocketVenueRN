/**
|--------------------------------------------------
| Interface for Venue Wide Band devices
| 2019 Dana Simmons
|--------------------------------------------------
*/
import Device from './libDevice'

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
        
    }
    _startScan(){
        const devicesToStart = this._getDevicesToScan()
        this._sendAsync(this.commands.startScan,devicesToStart)

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
    _sendRecursively (cmd,devices){
        //This might get weird
        console.log('current devices:',devices);
        let currentIndex = 0
        const nextDevice = ()=>{
            return devices[currentIndex++]
        }
        const sendRecursively = (callback=null)=>{
            if(currentIndex < devices.length){
                const deviceAddress = nextDevice().index
                console.group("recursive loop")
                console.log('deviceAddress',deviceAddress)
                console.log('nextDevice',nextDevice)
                console.log('sendRecursively',sendRecursively);
                const cmdStr = cmd.replace('*',deviceAddress)
                this._sendCmd(cmdStr)
                .then((resp)=>{
                    if(this._isOK(resp)){
                        console.log(resp);
                        callback && callback(resp)
                        sendRecursively()
                    }else{
                        throw new Error("Device Error: recieved error from device")
                    }
                })
            }else{
                console.log("We finished the recursion")
            }
        }
        sendRecursively()
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