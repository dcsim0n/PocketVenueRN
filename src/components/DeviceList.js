/**
|--------------------------------------------------
| Pocket Venue: Main Device List
| 2019 Dana Simmons
|--------------------------------------------------
*/

import React, { Component } from "react";
import { FlatList, Alert, Linking } from "react-native";
import NewDevice from "./NewDevice";
import DeviceListItem from "./DeviceListItem";
import { Button, Header, Icon, Container, Content, Left, Body, Right, Title } from "native-base";
import { newVenue, removeVenue, setActiveVenue, addSetting} from '../actions/actions'
import styles from '../stylesheets/appStyles'
import { connectDevice } from "../lib/withDevice";
import { connect } from 'react-redux'

class DeviceList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false
    }
  }


  addNewVenue = connectionSettings => {
    this.props.newVenue( connectionSettings);
  };

  onPressItem = connectionSettings => {
    const { device, preferences } = connectDevice(connectionSettings);
    this.props.setActiveVenue(connectionSettings.key)
    this.props.addSetting( preferences )
    this.props.navigation.push("Device"); //Push to the Device Details page
  };

  removeDevice = ( uuid ) => {
    this.props.removeVenue( uuid )
  };

  toggleEdit = () => {
    console.log("this.state.editing :", this.state.editing);
    this.setState({ editing: !this.state.editing });
  };

  renderItem = ({ item }) => (
    <DeviceListItem
      device={item}
      onPressItem={this.onPressItem}
      removeDevice={this.removeDevice}
      editing={this.state.editing}
    />
  );

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left style={{flexDirection:'row', marginRight:20}}>
              <NewDevice addNewVenue={data => this.addNewVenue(data)} />
          </Left>
          <Body>
            
              
            <Title style={styles.header}>Device List</Title>
            
          </Body>
          <Right>
            <Icon
              name="remove-circle-outline"
              onPress={() => this.toggleEdit()}
              style={this.state.editing ? { color: "red" } : { color: "blue" }}
            />
          </Right>
        </Header>
        <Content>
          <FlatList
            data={this.props.venues}
            editing={this.state.editing}
            renderItem={this.renderItem}
          />
        </Content>
      </Container>
    );
  }
  _openUrl({ url }) {
    console.log("Event:", url);
    this.props.navigation.push("ImportData", { url });
  }

  componentDidMount() {
    // Adds an event listener for urls that can be passed from other apps
    Linking.addEventListener("url", e => this._openUrl(e));
  }

  componentWillUnmount() {
    // Make sure to remove the listener we added above 
    Linking.removeEventListener("url", e => this._openUrl(e));
  }
}
const mapStateToProps = (state, props) => {
  return {
    ...props,
    venues: state.venues
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    newVenue: ( connectionSettings ) => dispatch( newVenue( connectionSettings )),
    addSetting: ( preferences ) => dispatch( addSetting( preferences )),
    removeVenue: ( uuid ) => dispatch(removeVenue( uuid )),
    setActiveVenue: ( uuid ) => dispatch(setActiveVenue( uuid ))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DeviceList)