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
        this.fetchData = this.fetchData.bind(this)
        this.commands = {
            deviceId: 'id ?\r',        //Device type
            blocks: 'block(*) ?\r',    //Reciever blocks
            battVolt: 'bvolts(*) ?\r', //Battery voltage
            battType: 'txbatt(*) ?\r', //Battery type as set in the device
            pilot: 'signal(*) ?\r',    //Pilot tone status
            rxmeter: 'rmeter(*) ?\r',  //Signal strength
            freqs: 'mhz(*) ?\r'        //Frequenies of the recievers

        }
        
    } 
    _fetchData(){
        const commands = this.commands
        try{
            this._sendCmd(commands.freqs)
            .then(data=>{
                console.log(data)
                this._sendCmd(commands.blocks)
                .then(console.log)
            })

        }
        catch(error){
            console.error("Data Fetch error")
            this.errorHandler(error)
        }
    }
       
    fetchData(){
        this._fetchData()
    }
}