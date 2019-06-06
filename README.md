# Pocket Venue React Native

## Getting Started
### [Please Use Yarn] Yarn package manager will save you a lot of headaches
## Setup
1. `yarn install`
2. `react-native link react-native-gesture-handler`
3. `react-native link react-native-tcp`
4. `./node_modules/.bin/rn-nodeify --install stream,process,util --hack`
5. `react-native run-ios` 

This should get you up and running

## What do you connect to?

This app is designed to connect to Lectrosonics Venue wireless devices. Compatible devices are listed below.
* Lectrosonics Venue Wide Band
* Lectrosonics Venue 2

**Future versions will support the following**
* Lectrosnics Duet M2T
* Lectrosonics D2

If you don't have any of these devices you can experiement with a simulator server I wrote [Venue Server](https://github.com/dcsim0n/pv-tcp-scan-test)