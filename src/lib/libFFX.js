/**
|--------------------------------------------------
| libFFX: converts ffx xml file into javascript objects
|--------------------------------------------------
*/
const ENCODING = 'utf8'; //TODO: abstract this and other constants into constants file

const debug = true;

const FileSystem = require('react-native-fs')

const {parseString} = require('xml2js')

export function ParseFFX(url){
    return new Promise((resolve,reject)=>{
        _ParseFFX(resolve,reject,url)
    })
}
function _ParseFFX(resolve, reject, url){
    //Open File from url if it is valid
    //Check if it is an xml/ffx format
    //if it is parse it into an JS Object
    //return promise for this data
    try{

        const decodedURL = decodeURI(url)
    
        debug && console.log("Opening URL: ",decodedURL)
    
        if(!decodedURL.includes("ffx")){
            throw new Error("File Error: file does not end with a valid 'ffx' extension")
        }
    
        openFile(decodedURL)
        .then(( data ) => {
            parseString(data, (err, result) => {
                try{
                    if(err){
                        throw err
                    }
                    resolve(checkObjectStructure(result))
                }catch(error){
                    reject(error)
                }
            })
        })
    }catch(error){
        reject(error)
    }

    

}

async function openFile(url){
    
    const fileStat = await FileSystem.stat(url)
   
    if(fileStat.isFile()){
        return FileSystem.readFile(fileStat.path,ENCODING)
    }else{
        console.log("Failed to open url:",url)
        throw new Error("File Error: url is not a valid file")
    }
}

function checkObjectStructure(xmlObject){
    
}