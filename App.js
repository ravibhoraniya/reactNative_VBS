/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, { Component } from 'react';
import { StyleSheet, Root, StatusBar, Dimensions, View, PermissionsAndroid, RefreshControl, FlatList, ActivityIndicator, Alert, ImageBackground, BackHandler } from 'react-native';
import { Container, Header, Title, Content, ListItem, List, Button, Left, Right, Body, Icon, Text, Form, Thumbnail, Item, Input, Picker, Textarea } from 'native-base';
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Scene, Router, Actions } from 'react-native-router-flux';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyC2flyC7kN0qrpnrNrNykD9Dq9GPsaQF3g';
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.1000;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


export default class Home extends Component {

  componentWillMount = () => {
    BackHandler.addEventListener('hardwareBackPress', () => Actions.pop());
  };

  render() {
    console.disableYellowBox = true;
    return (
      <Router>
        <Scene key="root">
          <Scene initial key="home" component={App} hideNavBar />
          <Scene key="detail" component={Detail} hideNavBar />
        </Scene>
      </Router>
    );
  }

};


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Address: ''
    }
  };

  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: '#D50320', }}>
          <Left style={{ flex: 1 }}>
            <Button transparent>
              <Icon name='menu-fold' type="AntDesign" />
            </Button>
          </Left>
          <Body style={styles.Headerbody}>
            <Title style={{ textAlign: 'center', width: '100%' }}>LOGO</Title>
          </Body>
          <Right style={{ flex: 1 }}>
            <Button transparent>
              <Icon name='xbox-controller-menu' type="MaterialCommunityIcons" />
            </Button>
          </Right>
        </Header>

        <View style={{ flex: 1 }}>
          <GooglePlacesAutocomplete
            placeholder='Enter Location'
            minLength={2}
            autoFocus={false}
            returnKeyType={'default'}
            listViewDisplayed='false'
            fetchDetails={true}
            onPress={(data, details = null) => {
              this.setState({
                Address: data.description
              });
            }}
            query={{
              key: 'AIzaSyC2flyC7kN0qrpnrNrNykD9Dq9GPsaQF3g',
              language: 'en', // language of the results
              types: '(cities)' // default: 'geocode'
            }}
            currentLocation={false}
            styles={{
              container: styles.textbox,
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 0,
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 45,
                color: '#5d5d5d',
                backgroundColor: '#fff',
                fontSize: 14,
                borderRadius: 30,
              },
              predefinedPlacesDescription: {
                color: '#1faadb'
              },
              listView: {
                backgroundColor: "#fff",
                marginTop: 10,
                zIndex: 1
              }
            }}
          />
          <Button
            style={{ position: 'absolute', bottom: 20, zIndex: 1, borderRadius: 30, backgroundColor: '#D50320', left: '35%' }}
            onPress={() => { Actions.detail({ address: this.state.Address }) }}
          >
            <Text>POST YOUR AD</Text>
          </Button>
          <MapView
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: 43.761572,
              longitude: -79.417123,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            style={{ height: '100%' }}
          >
            <Marker
              coordinate={{ latitude: 43.762121, longitude: -79.414318 }}
              title={"location 1"}
            />
            <Marker
              coordinate={{ latitude: 43.790286, longitude: -79.421650 }}
              title={"location 2"}
            />
          </MapView>
        </View>



      </Container >
    );
  }
};


class Detail extends Component {

  constructor(props) {
    super(props);
  };

  render() {

    return (
      <Container>
        <Header style={{ backgroundColor: '#D50320', }}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={() => { Actions.home() }}>
              <Icon name='md-arrow-back' type="Ionicons" />
            </Button>
          </Left>
          <Body style={styles.Headerbody}>
            <Title style={{ textAlign: 'center', width: '100%' }}>LOGO</Title>
          </Body>
          <Right style={{ flex: 1 }}>
          </Right>
        </Header>
        <Content>
          <View style={{ width: '100%', textAlign: 'center', flexDirection: 'row', justifyContent: "center", flexWrap: 'wrap', marginTop: 30 }}>
            <Icon name='images' type="Entypo" style={{ fontSize: 60, color: '#ff0000', }} />
            <Text style={{ fontSize: 18, color: '#ff0000', width: '100%', textAlign: 'center' }}>Add a Photo</Text>
          </View>
          <View style={{ width: '100%', textAlign: 'center', flexDirection: 'row', flexWrap: 'wrap', marginTop: 30, padding: 10, }}>
            <Text style={{ fontSize: 18, color: '#000', width: '100%', fontWeight: '900' }}>Property Address</Text>
            <Input value={this.props.address} style={{ borderBottomWidth: 2, borderColor: '#e1e1e1' }} placeholder="Address" />
          </View>
          <View style={{ width: '100%', textAlign: 'center', flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, padding: 10, }}>
            <Text style={{ fontSize: 18, color: '#000', width: '100%', fontWeight: '900' }}>Property Title</Text>
            <Input style={{ borderBottomWidth: 2, borderColor: '#e1e1e1' }} placeholder="Your property title" />
          </View>
          <View style={{ width: '100%', textAlign: 'center', flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, padding: 10, }}>
            <Text style={{ fontSize: 18, color: '#000', width: '100%', fontWeight: '900' }}>Describe more about your property</Text>
            <Textarea style={{ width: '100%', borderColor: '#e1e1e1' }} placeholder="Enter any notes here" rowSpan={5} />
          </View>
        </Content>
      </Container>
    )
  }

};

const styles = StyleSheet.create({
  Headerbody: {
    flex: 1,
  },
  textbox: {
    position: 'absolute',
    top: 10,
    width: '90%',
    marginLeft: '5%',
    zIndex: 1,
    paddingLeft: 10,
  }
}); 
