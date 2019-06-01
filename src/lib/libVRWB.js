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
    } 

    fetchData(){
        
        this._sendCmd('block(*) ?\r').then((data)=>{
            console.log('recieved some data',data)
        })
        return []
    }
}