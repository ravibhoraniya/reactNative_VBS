import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, PermissionsAndroid, ActivityIndicator, FlatList, Alert, ScrollView, ImageBackground, Image, TouchableOpacity, BackHandler } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Form, Grid, Col, Thumbnail, ListItem } from 'native-base';
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Actions } from 'react-native-router-flux';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { webRequest, webRequestWithToken, multipartRequest } from '../Constants/WebRequester';
import { base_url } from '../Constants/Constants';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from "@react-native-community/netinfo";

import Navbar from '../componet/Header';
import styles from '../Style';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyC2flyC7kN0qrpnrNrNykD9Dq9GPsaQF3g';
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.2000;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            LATITUDE: 0,
            LONGITUDE: 0,
            mapRender: true,
            routeList: [],
            marginBottom: 1,
            busList: [],
        };
    }

    componentDidMount() {
        this.turnonLocationAndUpdateLatlng();
        this.interval = setInterval(() => this._getBusList(), 3000);
        //this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleBackButton = () => {
        console.log(this.props);
        if (this.props.routeName === 'home') {
            Alert.alert(
                'Are you sure you want to exit the app?',
                '', [{
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => {
                        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
                        BackHandler.exitApp();
                    }
                },], {
                cancelable: false
            });
            return true;
        }
    }

    requestLocationPermission() {
        try {
            PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
            ).then((result) => {
                if (result['android.permission.ACCESS_COARSE_LOCATION']
                    && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {
                    this.turnonLocationAndUpdateLatlng()
                }
            });
        } catch (err) {

        }
    }

    turnonLocationAndUpdateLatlng() {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 }).then(data => {
            NetInfo.fetch().then((connectionInfo) => {
                console.log('connectionInfo');
                Geolocation.getCurrentPosition(
                    position => {
                        let latitude = position.coords.latitude
                        let longitude = position.coords.longitude
                        this.setState({
                            LATITUDE: latitude,
                            LONGITUDE: longitude,
                        });
                        this._getNearRouteList();
                    },
                    (error) => {
                        console.log(JSON.stringify(error));
                        this.turnonLocationAndUpdateLatlng()
                    },
                );
                if (connectionInfo.type === 'wifi') {
                    this.watchID = Geolocation.watchPosition(position => {
                        let latitude = position.coords.latitude
                        let longitude = position.coords.longitude
                        this.setState({
                            LATITUDE: latitude,
                            LONGITUDE: longitude,
                        });
                    },
                        (error) => {
                            console.log(JSON.stringify(error));
                            this.turnonLocationAndUpdateLatlng();
                        },
                        { enableHighAccuracy: false, timeout: 10000, maximumAge: 0, distanceFilter: 0.0001 },
                    );

                } else {
                    this.watchID = Geolocation.watchPosition(position => {
                        let latitude = position.coords.latitude
                        let longitude = position.coords.longitude
                        this.setState({
                            LATITUDE: latitude,
                            LONGITUDE: longitude,
                        });
                    },
                        (error) => {
                            console.log(JSON.stringify(error));
                            this.turnonLocationAndUpdateLatlng();
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0, distanceFilter: 0.0001 },
                    );
                }
            });
        }).catch(err => {
            this.turnonLocationAndUpdateLatlng();
        })
    }


    render() {
        var left = (
            <Left style={{ flex: 1 }}>
            </Left >
        );
        var right = (
            <Right style={{ flex: 1 }}>
                {/* <TouchableOpacity >
                    <Image resizeMode='cover' source={require('../image/setting.png')} style={{ width: 38, height: 38 }} />
                </TouchableOpacity> */}
                <Icon name="directions-fork" type="MaterialCommunityIcons"
                    style={{ color: '#fff' }}
                    onPress={() => Actions.popup()}
                />
            </Right>
        );
        return (
            <Container>
                <Navbar left={left} right={right} title="VBS" />

                {
                    this.state.mapRender === true ?
                        <ImageBackground
                            resizeMode='cover'
                            source={require('../image/busbk-2.jpeg')} style={{ width: width, height: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={{ fontSize: 16, color: '#fff', marginTop: 10 }}>Loading</Text>
                        </ImageBackground>
                        :
                        <View style={{ flex: 1 }}>
                            <Button rounded style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }} onPress={() => { this._mylocation() }}>
                                <Icon name="md-locate" type="Ionicons" style={{ color: '#fff' }}></Icon>
                            </Button>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                ref={el => { this.map = el; }}
                                initialRegion={{
                                    latitude: this.state.LATITUDE,
                                    longitude: this.state.LONGITUDE,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA
                                }}
                                showsUserLocation={true}
                                followsUserLocation={true}
                                showsMyLocationButton={true}
                                showsPointsOfInterest={true}
                                userLocationUpdateInterval={100}
                                style={{ height: '100%', marginBottom: this.state.marginBottom, }}
                                onMapReady={() => {
                                    this.setState({ marginBottom: 0 })
                                }}
                            >

                                {
                                    this.state.busList.map(marker => (
                                        <Marker
                                            coordinate={{ latitude: parseFloat(marker.cr_lat), longitude: parseFloat(marker.cr_long) }}
                                            title="Bus"
                                            image={require('../image/transport.png')}
                                        />
                                    ))
                                }

                                {
                                    this.state.routeList.map(element => {
                                        const origin = {
                                            latitude: parseFloat(element.start_lat),
                                            longitude: parseFloat(element.start_long)
                                        };
                                        const destination = {
                                            latitude: parseFloat(element.end_lat),
                                            longitude: parseFloat(element.end_long)
                                        };
                                        const waypoint = JSON.parse(element.waypoint);

                                        return (
                                            <View>
                                                <Marker
                                                    coordinate={origin}
                                                    title="Start"
                                                    image={require('../image/pin.png')}
                                                />
                                                <Marker
                                                    coordinate={destination}
                                                    title="End"
                                                    image={require('../image/pin.png')}
                                                />

                                                {
                                                    waypoint.map(marker => (
                                                        <Marker
                                                            coordinate={{ latitude: parseFloat(marker[0]), longitude: parseFloat(marker[1]) }}
                                                            title={marker.name}
                                                            image={require('../image/pin.png')}
                                                        />
                                                    ))
                                                }



                                                <MapViewDirections
                                                    origin={origin}
                                                    destination={destination}
                                                    apikey={GOOGLE_MAPS_APIKEY}
                                                    strokeWidth={4}
                                                    strokeColor="#1c2e4a"
                                                    waypoints={waypoint}
                                                    precision="high"
                                                    mode="DRIVING"
                                                    onStart={(params) => {
                                                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                                    }}
                                                />
                                            </View>
                                        )
                                    })
                                }
                            </MapView>
                        </View>
                }

            </Container>
        );
    }

    _mylocation() {
        var oringii = { latitude: this.state.LATITUDE, longitude: this.state.LONGITUDE };
        this.map.animateCamera({ center: oringii });
    }


    _getNearRouteList() {
        var params = '';
        let url = base_url + "user/get/route/list";
        webRequest(url, params, (err, result) => {
            if (!err && result) {
                if (result.status == '1') {
                    if (result.data) {
                        this.setState({
                            routeList: result.data,
                            mapRender: false,
                        });
                    } else {
                        this.setState({
                            mapRender: false,
                        });
                        Alert.alert('Wrong!!', 'No route found. Please try to reopen some time after.');
                    }
                }
            }
            else {
                Alert.alert('', err.message);
            }
        });
    }

    _getBusList() {
        var params = '';
        let url = base_url + "user/get/active/bus/list";
        webRequest(url, params, (err, result) => {
            if (!err && result) {
                if (result.status == '1') {
                    if (result.data) {
                        this.setState({
                            busList: result.data,
                        });
                    }
                }
            }
        });
    }


}