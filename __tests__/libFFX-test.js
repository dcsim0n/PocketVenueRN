import "react-native";

jest.mock("react-native-fs");

import { ParseFFX } from "../src/lib/libFFX";

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
});

describe('ParseFFX promise', () => {
  const fs = require("react-native-fs");
  test("Promise rejects without a valid file name", () => {
    expect.assertions(1);
    return ParseFFX(null).catch(e => {
      expect(e.name).toBe("Error");
    });
  });
  test("Checks that the url is a file", () => {
    //expect.assertions(1)
    ParseFFX("hello.ffx");
    expect(fs.stat).toBeCalled();
  });
  test("Does not try to open the file if it's not a file",()=>{
    fs.__setStatData(false)
    ParseFFX("hello.ffx");
    expect(fs.readFile).not.toBeCalled()
  })
  test("Trys to open if it is a valid file",()=>{
    fs.__setStatData(true)
    ParseFFX("hello.ffx");
    expect(fs.readFile).toBeCalled()
  })
  
  test("Promise rejects if it can't open the file", () => {
    expect.assertions(1);
    return ParseFFX("hello.ffx").catch(e => {
      expect(e.name).toBe("Error");
    });
  });
})

