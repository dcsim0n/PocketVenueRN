import "react-native";


import { ParseFFX } from "../src/lib/libFFX";

jest.mock('react-native-fs');


describe("Use React Native FS Mock", () => {
  const fs = require("react-native-fs");
  test("Uses Mock RNFS Module", () => {
    expect(fs).toBeDefined();
  });
  test("Have a stat method", () => {
    expect(fs.stat).toBeDefined();
  });
  test("Have a readFile property", () => {
    expect(fs.readFile).toBeDefined();
  });
  test("Stat rejects when it should", (done) =>{
    fs.__setStatData(false)
    fs.stat()
    .then( res =>{
      expect(res.isFile()).toBe(false)
      done()
    })
  })
});

describe('ParseFFX promise', () => {
  
  test("Promise rejects without a valid file name", () => {
    return ParseFFX(null).catch(e => {
      expect(e).toContain("Error");
    });
  });

  test("Checks that the url is a file", (done) => {
    const fs = require("react-native-fs");
    ParseFFX("test-ffx.ffx")
    .finally(()=>{
      expect(fs.stat).toBeCalled();
      done()
    })
  });
  test("Does not try to open the file if it's not a file",(done)=>{
    const fs = require("react-native-fs");
    fs.__setStatData(false)
    ParseFFX("test-ffx.ffx")
    .finally(() =>{
      expect(fs.readFile).not.toBeCalled()
      done()
    })
  })
  test("Trys to open if it is a valid file",(done)=>{
    const fs = require('react-native-fs');
    fs.__setStatData(true)
    ParseFFX("test-ffx.ffx")
    .finally(()=>{
      expect(fs.readFile).toBeCalled()
      done()
    })
  })
  
  test("Promise rejects if it can't open the file", (done) => {
    const fs = require('react-native-fs');
    fs.__setTestData("");
    return ParseFFX("test-ffx.ffx").catch(e => {
      expect(e).toBeDefined();
      done()
    });
  });
})

