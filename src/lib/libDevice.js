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
            resolve(data.toString(encoding))
            client.destroy()
        })
        client.on('error',(error)=>{
            reject(error)
        })
    })

}

export default class Device {
    constructor({type,name,address,port}){
        this.address = address
        this.port = port
        this.type = type
        this.name = name
        this._sendCmd = this._sendCmd.bind(this)
    }
    get _connectObj (){
        return {port: this.port, address: this.address}
    }
    _sendCmd(cmd){
        return sendCmd(this._connectObj,cmd)
    }
    // fetchData(){
    //     const data = [
    //         {description: "RX 1"},
    //         {description: "RX 2"},
    //         {description: "RX 3"},
    //         {description: "RX 4"},
    //         {description: "RX 5"},
    //         {description: "RX 6"}
    //     ]
    //     return data
    // }

    
    
}