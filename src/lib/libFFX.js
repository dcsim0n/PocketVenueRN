/**
|--------------------------------------------------
| libFFX: converts ffx xml file into javascript objects
|--------------------------------------------------
*/
const ENCODING = "utf8"; //TODO: abstract this and other constants into constants file

const DEBUG = true;

const FileSystem = require("react-native-fs");

const { parseString } = require("xml2js");

export function ParseFFX(url) {
  return new Promise((resolve, reject) => {
    _ParseFFX(resolve, reject, url);
  });
}
function _ParseFFX(resolve, reject, url) {
  //Open File from url if it is valid
  //Check if it is an xml/ffx format
  //if it is parse it into an JS Object
  //return promise for this data
  try {
    const decodedURL = decodeURI(url);
    DEBUG && console.log("Opening URL: ", decodedURL);
    if (!decodedURL.includes("ffx")) {
      throw new Error(
        "File Error: file does not end with a valid 'ffx' extension"
      );
    }

    openFile(decodedURL).then(data => {
      parseString(
        data,
        { ignorAttrs: true, mergeAttrs: true, explicitArray: false },
        (err, result) => {
          try {
            if (err) {
              throw err;
            }
            if(result.FFX === undefined){
              throw new Error("File Error: missing FFX property")
            }
            resolve(result.FFX);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    reject(error);
  }
}

async function openFile(url) {
  const fileStat = await FileSystem.stat(url);

  if (fileStat.isFile()) {
    DEBUG && console.log("File is valid", url);
    return await FileSystem.readFile(fileStat.path, ENCODING);
  } else {
    DEBUG && console.log("Failed to open url:", url);
    throw new Error("File Error: url is not a valid file");
  }
}

