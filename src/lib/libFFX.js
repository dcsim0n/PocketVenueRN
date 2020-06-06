/**
|--------------------------------------------------
| libFFX: converts ffx xml file into javascript objects
|--------------------------------------------------
*/
const ENCODING = "utf8"; //TODO: abstract this and other constants into constants file

const DEBUG = true;

const FileSystem = require("react-native-fs");

const { Builder, parseStringPromise } = require("xml2js");


export function ParseFFX(url) {
  // return new Promise((resolve, reject) => {
  //   _ParseFFX(resolve, reject, url);
  // });
  //Open File from url if it is valid
  //Check if it is an xml/ffx format
  //if it is parse it into an JS Object
  //return promise for this data
  const decodedURL = decodeURI(url);
  DEBUG && console.log("Opening URL: ", decodedURL);
  if (!decodedURL.includes("ffx")) {
    return Promise.reject("File Error: file does not end with a valid 'ffx' extension");
  }

  return openFile(decodedURL)
  .then(data => {
    return parseStringPromise(data, {mergeAttrs: true, explicitArray: false})
    .then((result) => {
      if(result.FFX === undefined){
        return Promise.reject("File Error: file does not end with a valid 'ffx' extension")
      }
      DEBUG && console.log('result.FFX', result.FFX);
      return result.FFX;
    });
  });
}
function _RenderFFX(txList){
  const builder = new Builder({ rootName: "FFX" })
  
}
async function openFile(url) {
  const fileStat = await FileSystem.stat(url);

  if (fileStat.isFile()) {
    DEBUG && console.log("File is valid", url);
    return await FileSystem.readFile(fileStat.path, ENCODING);
  } else {
    DEBUG && console.log("Failed to open url:", url);
    return Promise.reject("File Error: url is not a valid file");
  }
}

