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

    _pollScanData(){
        //Iterate over list of devices that are scanning
        //Send commands to retrieve data from them
        //Organize data and update _scanData acordingly
        //Call event handler to let clients know data is updated
    } 

    _getDevicesToScan(){
        //Iterate over known devices
        //Calculate which devices are unique and set a 'scan' flag
        //Return array of references to the devices
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
                                    index: i,
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
}