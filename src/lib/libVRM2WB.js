/**
|--------------------------------------------------
| Interface for Venue 2 devices
| 2019 Dana Simmons
|--------------------------------------------------
*/

import Device from './libDevice';

export default class VRM2WB extends Device {
    constructor(options){
        super(options)
        
    }
    _fetchData(){
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
                                    block: blocks[i],
                                    frequency: freqs[i],
                                    voltage: volts[i],
                                    pilot: pilots[i]
                                })
                            }
                            this.dataHandler(retData) //Call handler with our data
                        })
                    })
                })
            }).catch((error)=>{
                console.log(error)
            })
    }
    
}