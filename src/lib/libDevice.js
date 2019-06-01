import { endianness } from 'os';

const net = require('react-native-tcp')
const encoding = 'utf8'

function fetchData({address,port},data) {
    const client = net.createConnection(port,address,()=>{
        client.setEncoding(encoding)
        client.write(data)
    })
    return new Promise(function(resolve,reject){
        client.on('data',(data)=>{
            resolve(data)
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
    }

    fetchData(){
        const data = [
            {description: "RX 1"},
            {description: "RX 2"},
            {description: "RX 3"},
            {description: "RX 4"},
            {description: "RX 5"},
            {description: "RX 6"}
        ]
        return data
    }
    
}