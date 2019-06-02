/**
|--------------------------------------------------
| Device defenition for M2T Duet system
| 2019 Dana Simmons
|--------------------------------------------------
*/
import Device from './libDevice';

export default class M2T extends Device{
    constructor(options){
        super(options)

        this.commands = {
            pilot: 'txrfenable(1) ?\r',
            freqs: 'txrffreq(*) ?\r'
        }
    }


}